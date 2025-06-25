import { useQuery } from "@tanstack/react-query";
import { Competition } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "./countdown-timer";
import SkillQuestionModal from "./skill-question-modal";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const [showSkillModal, setShowSkillModal] = useState(false);

  const { data: competitions } = useQuery<Competition[]>({
    queryKey: ['/api/competitions'],
  });

  // Get the first active competition for the hero showcase
  const featuredCompetition = competitions?.find(comp => comp.status === 'active');

  const handleEnterClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/api/login';
      return;
    }
    if (featuredCompetition) {
      setShowSkillModal(true);
    }
  };

  return (
    <section className="hero-gradient text-white py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Luxury mountain landscape" 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6">
              Win Your Dream <span className="text-gold-400">Holiday</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Enter skill-based competitions to win luxury travel experiences. From Maldives retreats to Swiss Alps adventures.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                className="gold-gradient text-navy-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = '/competitions'}
              >
                Enter Competition
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-navy-900 transition-all duration-300"
                onClick={() => window.location.href = '#'}
              >
                How It Works
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">2,847</div>
                <div className="text-sm text-gray-400">Happy Winners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">£2.4M</div>
                <div className="text-sm text-gray-400">Prizes Won</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">4.9★</div>
                <div className="text-sm text-gray-400">User Rating</div>
              </div>
            </div>
          </div>
          
          {/* Live Competition Showcase */}
          {featuredCompetition && (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <Badge className="bg-gold-500 text-navy-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  🔥 LIVE NOW
                </Badge>
                <h3 className="text-2xl font-serif font-bold mb-2">{featuredCompetition.title}</h3>
                <p className="text-gray-300">{featuredCompetition.description}</p>
              </div>
              
              {/* Competition Image */}
              <div className="relative mb-6 rounded-2xl overflow-hidden">
                <img 
                  src={featuredCompetition.imageUrl} 
                  alt={featuredCompetition.title}
                  className="w-full h-64 object-cover" 
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  Worth {formatCurrency(featuredCompetition.prizeValue)}
                </div>
              </div>
              
              {/* Countdown Timer */}
              <CountdownTimer endDate={featuredCompetition.endDate} className="mb-6" />
              
              {/* Entry Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Entries</span>
                  <span className="text-gold-400">
                    {featuredCompetition.currentEntries.toLocaleString()} / {featuredCompetition.maxEntries.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gold-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${calculateProgress(featuredCompetition.currentEntries, featuredCompetition.maxEntries)}%` 
                    }}
                  />
                </div>
              </div>
              
              <Button
                className="w-full gold-gradient text-navy-900 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                onClick={handleEnterClick}
              >
                Enter for {formatCurrency(featuredCompetition.entryPrice)}
              </Button>
              
              {/* Legal Disclaimer */}
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                UK skill-based competition. Entry requires answering a question of skill. 18+ only. T&Cs apply.
              </p>
            </div>
          )}
        </div>
      </div>

      {featuredCompetition && (
        <SkillQuestionModal
          competition={featuredCompetition}
          isOpen={showSkillModal}
          onClose={() => setShowSkillModal(false)}
        />
      )}
    </section>
  );
}
