import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Competition } from "@shared/schema";
import { formatCurrency, formatTimeRemaining, calculateProgress } from "@/lib/utils";
import { Clock, MapPin, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SkillQuestionModal from "./skill-question-modal";
import { useState } from "react";

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const { isAuthenticated } = useAuth();
  const [showSkillModal, setShowSkillModal] = useState(false);
  
  const progress = calculateProgress(competition.currentEntries, competition.maxEntries);
  const timeRemaining = formatTimeRemaining(competition.endDate);
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'luxury':
        return 'bg-navy-900 text-gold-400';
      case 'wellness':
        return 'bg-gold-500 text-navy-900';
      case 'adventure':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleEnterClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/api/login';
      return;
    }
    setShowSkillModal(true);
  };

  return (
    <>
      <Card className="competition-card bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        <div className="relative">
          <img 
            src={competition.imageUrl} 
            alt={competition.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge className={`${getCategoryColor(competition.category)} font-semibold text-sm`}>
              {competition.category.toUpperCase()}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {formatCurrency(competition.prizeValue)}
          </div>
        </div>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">
            {competition.title}
          </h3>
          <p className="text-navy-700 mb-4">{competition.description}</p>
          
          <div className="flex items-center text-sm text-navy-600 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{competition.destination}</span>
          </div>
          
          <div className="flex items-center text-sm text-navy-600 mb-4">
            <Clock className="w-4 h-4 mr-2" />
            <span>{timeRemaining}</span>
          </div>
          
          {/* Entry Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-navy-600">Entries</span>
              <span className="text-gold-600 font-semibold">
                {competition.currentEntries.toLocaleString()} / {competition.maxEntries.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gold-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <Button
            className="w-full bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-xl font-semibold transition-colors duration-300"
            onClick={handleEnterClick}
            disabled={competition.status !== 'active' || progress >= 100}
          >
            {competition.status !== 'active' 
              ? 'Competition Closed' 
              : progress >= 100 
                ? 'Competition Full'
                : `Enter for ${formatCurrency(competition.entryPrice)}`
            }
          </Button>
        </CardContent>
      </Card>

      <SkillQuestionModal
        competition={competition}
        isOpen={showSkillModal}
        onClose={() => setShowSkillModal(false)}
      />
    </>
  );
}
