import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { useQuery } from "@tanstack/react-query";
import { Entry, Competition } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Users, Gift, TrendingUp, Calendar, MapPin } from "lucide-react";
import { formatCurrency, formatTimeRemaining } from "@/lib/utils";

export default function Dashboard() {
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

  const { data: entries, isLoading: entriesLoading } = useQuery<Entry[]>({
    queryKey: ['/api/entries/user'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const activeEntries = entries?.filter(entry => {
    const comp = entry.competition;
    return comp && comp.status === 'active' && new Date(comp.endDate) > new Date();
  }) || [];

  const pastEntries = entries?.filter(entry => {
    const comp = entry.competition;
    return comp && (comp.status !== 'active' || new Date(comp.endDate) <= new Date());
  }) || [];

  return (
    <div className="min-h-screen bg-soft-cream">
      <Navigation />
      
      {/* Header */}
      <section className="hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Welcome back, {user?.firstName || 'Explorer'}!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Track your competition entries and manage your account.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Entries</CardTitle>
              <Trophy className="h-4 w-4 text-gold-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.totalEntries || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Competitions entered
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-gold-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : formatCurrency(stats?.totalSpent || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                On competition entries
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Gift className="h-4 w-4 text-gold-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : `${stats?.winRate || 0}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                Success rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referrals</CardTitle>
              <Users className="h-4 w-4 text-gold-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.referrals || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Friends invited
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold-500" />
                Active Entries ({activeEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {entriesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg h-20 animate-pulse" />
                  ))}
                </div>
              ) : activeEntries.length > 0 ? (
                <div className="space-y-4">
                  {activeEntries.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-navy-900">
                          {entry.competition?.title}
                        </h4>
                        <Badge 
                          variant={entry.isCorrect ? "default" : "destructive"}
                          className={entry.isCorrect ? "bg-green-100 text-green-800" : ""}
                        >
                          {entry.isCorrect ? "Qualified" : "Incorrect"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {entry.competition?.destination}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          Entry: {formatCurrency(entry.amount)}
                        </span>
                        <span className="text-gold-600 font-medium">
                          {entry.competition?.endDate ? formatTimeRemaining(entry.competition.endDate) : 'TBD'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No active entries yet</p>
                  <Button 
                    onClick={() => window.location.href = '/competitions'}
                    className="bg-gold-500 hover:bg-gold-600 text-white"
                  >
                    Enter Competition
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {entriesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg h-16 animate-pulse" />
                  ))}
                </div>
              ) : entries && entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center mr-3">
                          <Trophy className="h-5 w-5 text-gold-600" />
                        </div>
                        <div>
                          <p className="font-medium text-navy-900 text-sm">
                            {entry.competition?.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={entry.isCorrect ? "default" : "secondary"}
                        className={entry.isCorrect ? "bg-green-100 text-green-800" : ""}
                      >
                        {entry.isCorrect ? "✓" : "✗"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activity yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-20 bg-white hover:bg-gray-50 text-navy-900 border border-gray-200 rounded-2xl flex items-center justify-center space-x-3"
              onClick={() => window.location.href = '/competitions'}
            >
              <Trophy className="h-6 w-6 text-gold-500" />
              <span className="font-semibold">Browse Competitions</span>
            </Button>
            
            <Button 
              className="h-20 bg-white hover:bg-gray-50 text-navy-900 border border-gray-200 rounded-2xl flex items-center justify-center space-x-3"
              onClick={() => window.location.href = '#'}
            >
              <Users className="h-6 w-6 text-gold-500" />
              <span className="font-semibold">Refer Friends</span>
            </Button>
            
            <Button 
              className="h-20 bg-white hover:bg-gray-50 text-navy-900 border border-gray-200 rounded-2xl flex items-center justify-center space-x-3"
              onClick={() => window.location.href = '#'}
            >
              <Gift className="h-6 w-6 text-gold-500" />
              <span className="font-semibold">View Rewards</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
