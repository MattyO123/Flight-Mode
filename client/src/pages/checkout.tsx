import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Competition } from "@shared/schema";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Clock, Trophy, Shield } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ competition }: { competition: Competition }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Your entry has been submitted successfully!",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 rounded-xl text-lg font-semibold"
      >
        {isProcessing ? 'Processing...' : `Pay ${formatCurrency(competition.entryPrice)}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { competitionId } = useParams();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [answer, setAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to enter competitions.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: competition, isLoading: competitionLoading } = useQuery<Competition>({
    queryKey: [`/api/competitions/${competitionId}`],
    enabled: !!competitionId,
  });

  useEffect(() => {
    if (competition && answer !== null) {
      // Create PaymentIntent when competition is loaded and answer is selected
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: parseFloat(competition.entryPrice),
        competitionId: competition.id 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [competition, answer, toast]);

  if (isLoading || competitionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-navy-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-600 mb-2">Competition Not Found</h1>
          <p className="text-gray-500">The competition you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Competition Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Competition Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden">
                  <img 
                    src={competition.imageUrl} 
                    alt={competition.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {formatCurrency(competition.prizeValue)}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">
                    {competition.title}
                  </h3>
                  <p className="text-navy-700 mb-4">{competition.description}</p>
                  
                  <div className="flex items-center text-sm text-navy-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    {competition.destination}
                  </div>
                  
                  <div className="flex items-center text-sm text-navy-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {competition.duration}
                  </div>
                </div>
                
                <div className="bg-gold-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-navy-900 font-semibold">Entry Price:</span>
                    <span className="text-2xl font-bold text-gold-600">
                      {formatCurrency(competition.entryPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-navy-600">
                    <span>Odds of winning:</span>
                    <span>1 in {competition.maxEntries.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Entry Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Enter Competition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skill Question */}
                <div className="bg-navy-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-navy-900 mb-4">
                    Skill Question
                  </h4>
                  <p className="text-navy-700 mb-4">
                    {competition.skillQuestion.question}
                  </p>
                  
                  <div className="space-y-3">
                    {competition.skillQuestion.options.map((option, index) => (
                      <label key={index} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="answer"
                          value={index}
                          checked={answer === index}
                          onChange={(e) => setAnswer(parseInt(e.target.value))}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded-full mr-3 flex-shrink-0 transition-colors ${
                          answer === index 
                            ? 'bg-gold-500 border-gold-500' 
                            : 'border-gray-300'
                        }`} />
                        <span className="text-navy-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Form */}
                {answer !== null && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <div>
                      <h4 className="text-lg font-semibold text-navy-900 mb-4">
                        Payment Details
                      </h4>
                      <CheckoutForm competition={competition} />
                    </div>
                  </Elements>
                ) : answer !== null ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Preparing payment...</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Please answer the skill question to continue</p>
                  </div>
                )}

                {/* Legal Notice */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-gold-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        By entering, you confirm you are 18+ and agree to our Terms & Conditions. 
                        UK skill-based competition. Skill question must be answered correctly to qualify. 
                        Payment is non-refundable once submitted.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
