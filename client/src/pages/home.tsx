import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { useQuery } from "@tanstack/react-query";
import { Competition } from "@shared/schema";
import CompetitionCard from "@/components/competition-card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, TrendingUp, Gift } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: competitions, isLoading: competitionsLoading } = useQuery<Competition[]>({
    queryKey: ['/api/competitions'],
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const activeCompetitions = competitions?.filter(c => c.status === 'active') || [];
  const featuredCompetitions = activeCompetitions.slice(0, 3);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Welcome back, {user?.firstName || 'Explorer'}!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your next luxury adventure awaits. Discover new competitions and track your journey.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Trophy className="h-8 w-8 text-gold-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gold-400">
                  {statsLoading ? '...' : userStats?.totalEntries || 0}
                </div>
                <div className="text-sm text-gray-400">Active Entries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Gift className="h-8 w-8 text-gold-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gold-400">
                  {statsLoading ? '...' : userStats?.totalWins || 0}
                </div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <TrendingUp className="h-8 w-8 text-gold-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gold-400">
                  {statsLoading ? '...' : `${userStats?.winRate || 0}%`}
                </div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Clock className="h-8 w-8 text-gold-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gold-400">
                  {statsLoading ? '...' : userStats?.referrals || 0}
                </div>
                <div className="text-sm text-gray-400">Referrals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Competitions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-4">
                Live Competitions
              </h2>
              <p className="text-xl text-navy-700">
                Enter now for your chance to win luxury travel experiences.
              </p>
            </div>
            <Button 
              className="bg-navy-900 hover:bg-navy-800 text-white px-6 py-3 rounded-full"
              onClick={() => window.location.href = '/competitions'}
            >
              View All
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitionsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-3xl h-96 animate-pulse" />
              ))
            ) : featuredCompetitions.length > 0 ? (
              featuredCompetitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Competitions</h3>
                <p className="text-gray-500">Check back soon for exciting new competitions!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-navy-700">
              Manage your account and explore new opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button 
              className="h-32 bg-white hover:bg-gray-50 text-navy-900 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-3"
              onClick={() => window.location.href = '/dashboard'}
            >
              <Trophy className="h-8 w-8 text-gold-500" />
              <span className="font-semibold">My Dashboard</span>
            </Button>
            
            <Button 
              className="h-32 bg-white hover:bg-gray-50 text-navy-900 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-3"
              onClick={() => window.location.href = '/competitions'}
            >
              <Clock className="h-8 w-8 text-gold-500" />
              <span className="font-semibold">Browse Competitions</span>
            </Button>
            
            <Button 
              className="h-32 bg-white hover:bg-gray-50 text-navy-900 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-3"
              onClick={() => window.location.href = '#'}
            >
              <Gift className="h-8 w-8 text-gold-500" />
              <span className="font-semibold">Refer Friends</span>
            </Button>
            
            <Button 
              className="h-32 bg-white hover:bg-gray-50 text-navy-900 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-3"
              onClick={() => window.location.href = '#'}
            >
              <TrendingUp className="h-8 w-8 text-gold-500" />
              <span className="font-semibold">View History</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
