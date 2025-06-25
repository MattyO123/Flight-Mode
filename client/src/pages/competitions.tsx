import Navigation from "@/components/navigation";
import CompetitionCard from "@/components/competition-card";
import { useQuery } from "@tanstack/react-query";
import { Competition } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Filter } from "lucide-react";
import { useState } from "react";

export default function Competitions() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('ending-soon');

  const { data: competitions, isLoading } = useQuery<Competition[]>({
    queryKey: ['/api/competitions', categoryFilter === 'all' ? undefined : categoryFilter],
  });

  const filteredAndSortedCompetitions = competitions?.filter(comp => {
    if (categoryFilter === 'all') return true;
    return comp.category === categoryFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'ending-soon':
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return parseFloat(a.entryPrice) - parseFloat(b.entryPrice);
      case 'price-high':
        return parseFloat(b.entryPrice) - parseFloat(a.entryPrice);
      case 'prize-value':
        return parseFloat(b.prizeValue) - parseFloat(a.prizeValue);
      default:
        return 0;
    }
  }) || [];

  return (
    <div className="min-h-screen bg-navy-50">
      <Navigation />
      
      {/* Header */}
      <section className="hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              All Competitions
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover luxury travel experiences and win your dream holiday through skill-based competitions.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gold-400">
                    {competitions?.length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Active Competitions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gold-400">
                    £{competitions?.reduce((sum, comp) => sum + parseFloat(comp.prizeValue), 0).toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-400">Total Prize Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-navy-700" />
              <span className="font-semibold text-navy-900">Filter & Sort:</span>
            </div>
            
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="prize-value">Prize Value</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Competitions Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-3xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredAndSortedCompetitions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedCompetitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Trophy className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                No Competitions Found
              </h3>
              <p className="text-gray-500 mb-8">
                {categoryFilter !== 'all' 
                  ? `No competitions found in the ${categoryFilter} category.`
                  : 'No competitions are currently available.'
                }
              </p>
              {categoryFilter !== 'all' && (
                <Button 
                  onClick={() => setCategoryFilter('all')}
                  className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-full"
                >
                  View All Competitions
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-6">
            Ready to Win Your Dream Holiday?
          </h2>
          <p className="text-xl text-navy-700 mb-8">
            Join thousands of winners who have already experienced luxury travel through our skill-based competitions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full text-lg font-semibold"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline"
              className="border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white px-8 py-4 rounded-full text-lg font-semibold"
              onClick={() => window.location.href = '#'}
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
