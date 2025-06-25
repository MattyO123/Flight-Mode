import { 
  users, 
  competitions, 
  entries,
  type User, 
  type UpsertUser,
  type Competition,
  type Entry,
  type InsertCompetition,
  type InsertEntry
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Storage interface
interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: UpsertUser): Promise<User>;
  
  // Competition methods
  getCompetitions(filters?: { category?: string; status?: string }): Promise<Competition[]>;
  getCompetition(id: number): Promise<Competition | undefined>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  
  // Entry methods
  getUserCompetitionEntry(userId: string, competitionId: number): Promise<Entry | undefined>;
  createEntry(entry: InsertEntry): Promise<Entry>;
  getUserEntries(userId: string): Promise<Entry[]>;
  
  // Stats methods
  getUserStats(userId: string): Promise<{
    totalEntries: number;
    totalSpent: number;
    activeEntries: number;
    correctAnswers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCompetitions(filters?: { category?: string; status?: string }): Promise<Competition[]> {
    let query = db.select().from(competitions);
    
    if (filters?.status) {
      query = query.where(eq(competitions.status, filters.status));
    }
    
    if (filters?.category) {
      query = query.where(eq(competitions.category, filters.category));
    }
    
    return await query.orderBy(desc(competitions.createdAt));
  }

  async getCompetition(id: number): Promise<Competition | undefined> {
    const [competition] = await db.select().from(competitions).where(eq(competitions.id, id));
    return competition || undefined;
  }

  async createCompetition(competition: InsertCompetition): Promise<Competition> {
    const [newCompetition] = await db
      .insert(competitions)
      .values(competition)
      .returning();
    return newCompetition;
  }

  async getUserCompetitionEntry(userId: string, competitionId: number): Promise<Entry | undefined> {
    const [entry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.userId, userId), eq(entries.competitionId, competitionId)));
    return entry || undefined;
  }

  async createEntry(entry: InsertEntry): Promise<Entry> {
    const [newEntry] = await db
      .insert(entries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getUserEntries(userId: string): Promise<Entry[]> {
    return await db
      .select()
      .from(entries)
      .where(eq(entries.userId, userId))
      .orderBy(desc(entries.createdAt));
  }

  async getUserStats(userId: string): Promise<{
    totalEntries: number;
    totalSpent: number;
    activeEntries: number;
    correctAnswers: number;
  }> {
    const userEntries = await this.getUserEntries(userId);
    
    return {
      totalEntries: userEntries.length,
      totalSpent: userEntries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0),
      activeEntries: userEntries.length, // Simplified for now
      correctAnswers: userEntries.filter(entry => entry.isCorrect).length,
    };
  }
}

export const storage = new DatabaseStorage();