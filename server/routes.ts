import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertEntrySchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Competition routes
  app.get('/api/competitions', async (req, res) => {
    try {
      const { category, status = 'active' } = req.query;
      const competitions = await storage.getCompetitions({
        category: category as string,
        status: status as string,
      });
      res.json(competitions);
    } catch (error) {
      console.error("Error fetching competitions:", error);
      res.status(500).json({ message: "Failed to fetch competitions" });
    }
  });

  app.get('/api/competitions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const competition = await storage.getCompetition(parseInt(id));
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }
      res.json(competition);
    } catch (error) {
      console.error("Error fetching competition:", error);
      res.status(500).json({ message: "Failed to fetch competition" });
    }
  });

  // Entry routes
  app.post('/api/entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = insertEntrySchema.parse({
        ...req.body,
        userId,
      });

      // Validate competition exists and is active
      const competition = await storage.getCompetition(entryData.competitionId);
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }

      if (competition.status !== 'active') {
        return res.status(400).json({ message: "Competition is not active" });
      }

      if (competition.currentEntries >= competition.maxEntries) {
        return res.status(400).json({ message: "Competition is full" });
      }

      // Check if user already entered this competition
      const existingEntry = await storage.getUserCompetitionEntry(userId, entryData.competitionId);
      if (existingEntry) {
        return res.status(400).json({ message: "You have already entered this competition" });
      }

      // Check if answer is correct
      const isCorrect = entryData.answer === competition.skillQuestion.correctAnswer;
      
      const entry = await storage.createEntry({
        ...entryData,
        isCorrect,
      });

      res.json(entry);
    } catch (error) {
      console.error("Error creating entry:", error);
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  app.get('/api/entries/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getUserEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching user entries:", error);
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Payment routes
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
    try {
      const { amount, competitionId } = req.body;
      const userId = req.user.claims.sub;

      // Validate competition
      const competition = await storage.getCompetition(competitionId);
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }

      // Validate amount matches competition entry price
      const expectedAmount = parseFloat(competition.entryPrice);
      if (Math.abs(amount - expectedAmount) > 0.01) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to pence
        currency: "gbp",
        metadata: {
          userId,
          competitionId: competitionId.toString(),
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Admin routes (protected)
  app.post('/api/admin/competitions', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const competitionData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.createCompetition(competitionData);
      res.json(competition);
    } catch (error) {
      console.error("Error creating competition:", error);
      res.status(500).json({ message: "Failed to create competition" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
