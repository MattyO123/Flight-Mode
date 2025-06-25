import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import { useQuery } from "@tanstack/react-query";
import { Competition } from "@shared/schema";
import CompetitionCard from "@/components/competition-card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Trophy, Shield } from "lucide-react";

export default function Landing() {
  const { data: competitions, isLoading } = useQuery<Competition[]>({
    queryKey: ['/api/competitions'],
  });

  const featuredCompetitions = competitions?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <HeroSection />
      
      {/* Featured Competitions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-6">
              Featured Competitions
            </h2>
            <p className="text-xl text-navy-700 max-w-3xl mx-auto">
              Discover luxury travel experiences and win your dream holiday through skill-based competitions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
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
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Competitions Available</h3>
                <p className="text-gray-500">Check back soon for exciting new competitions!</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full text-lg font-semibold"
              onClick={() => window.location.href = '/competitions'}
            >
              View All Competitions
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-navy-700 max-w-3xl mx-auto">
              Three simple steps to win your dream holiday. All competitions are skill-based and legally compliant.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-gold-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-serif font-bold text-navy-900 mb-4">Choose Competition</h3>
              <p className="text-navy-700 leading-relaxed">
                Browse our curated selection of luxury travel experiences and pick your dream destination.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gold-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-serif font-bold text-navy-900 mb-4">Answer Skill Question</h3>
              <p className="text-navy-700 leading-relaxed">
                Complete our skill-based question or mini-game. No luck involved - it's all about knowledge and skill.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gold-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-serif font-bold text-navy-900 mb-4">Win Your Dream Trip</h3>
              <p className="text-navy-700 leading-relaxed">
                If selected, we'll arrange everything for your luxury holiday. Travel dates flexible to suit you.
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-white rounded-2xl p-8 border-l-4 border-gold-500">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-gold-500 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-navy-900 mb-2">Legally Compliant & Fair</h4>
                <p className="text-navy-700">
                  All competitions comply with UK skill-based competition laws. Every entry requires answering a question of skill or judgment. 
                  Odds of winning displayed clearly. No gambling elements present. 18+ only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-6">
              Winner Stories
            </h2>
            <p className="text-xl text-navy-700 max-w-3xl mx-auto">
              Real stories from our competition winners who turned their dreams into reality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                prize: "Maldives Winner",
                quote: "Absolutely incredible experience! The whole process was transparent and fair. Won my dream Maldives holiday and it exceeded all expectations.",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
              },
              {
                name: "James R.",
                prize: "Swiss Alps Winner",
                quote: "The skill questions were challenging but fair. Love that it's not just luck - you actually need to think! Won the Swiss Alps trip and it was life-changing.",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
              },
              {
                name: "Emma K.",
                prize: "Japan Winner",
                quote: "Professional, trustworthy, and exciting! The Japan wellness retreat was perfectly organized. I've already entered three more competitions!",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-navy-900">{testimonial.name}</h4>
                    <p className="text-sm text-navy-600">{testimonial.prize}</p>
                  </div>
                </div>
                <div className="flex text-gold-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-navy-700 leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <h3 className="text-2xl font-serif font-bold mb-4">Flight Mode</h3>
              <p className="text-gray-400 mb-6">Win luxury travel experiences through skill-based competitions.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Competitions</h4>
              <ul className="space-y-2">
                <li><a href="/competitions" className="text-gray-400 hover:text-gold-400 transition-colors">Current Competitions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Competition Rules</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gold-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Flight Mode Competitions. All rights reserved. Registered in England & Wales.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-400 text-sm mr-4">18+ UK Residents Only.</span>
              <span className="text-gray-400 text-sm">Skill-Based Competitions</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
