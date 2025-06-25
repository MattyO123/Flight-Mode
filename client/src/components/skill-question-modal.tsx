import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Competition } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Shield, X } from "lucide-react";

interface SkillQuestionModalProps {
  competition: Competition;
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillQuestionModal({ competition, isOpen, onClose }: SkillQuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    // Redirect to checkout with the selected answer
    window.location.href = `/checkout/${competition.id}`;
  };

  const handleClose = () => {
    setSelectedAnswer(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="skill-question-modal max-w-lg mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-serif font-bold text-navy-900">
              Skill Question
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Question */}
          <div className="bg-navy-50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-navy-900 mb-4">
              {competition.skillQuestion.question}
            </h4>
            <div className="space-y-3">
              {competition.skillQuestion.options.map((option, index) => (
                <label key={index} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="skillAnswer"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded-full mr-3 flex-shrink-0 transition-colors ${
                    selectedAnswer === index 
                      ? 'bg-gold-500 border-gold-500' 
                      : 'border-gray-300'
                  }`} />
                  <span className="text-navy-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Entry Details */}
          <div className="bg-gold-50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
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
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-navy-900 hover:bg-gray-50"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 gold-gradient text-navy-900 hover:shadow-xl transition-all duration-300"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Continue to Payment
            </Button>
          </div>
          
          {/* Legal Notice */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-gold-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  By entering, you confirm you are 18+ and agree to our Terms & Conditions. 
                  UK skill-based competition. Skill question must be answered correctly to qualify.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
