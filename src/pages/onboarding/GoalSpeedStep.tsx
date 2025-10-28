import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sparkles, Rabbit, Snail, Bird } from 'lucide-react';

export default function GoalSpeedStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  // Calculate weight difference
  const currentWeight = data.weight || 70;
  const goalWeight = data.weightGoal || 60;
  const weightDifference = Math.abs(currentWeight - goalWeight);

  // Initialize with default 1.0 kg/week or saved value
  const [weeklyRate, setWeeklyRate] = useState(data.weeklyWeightLoss || 1.0);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleRecommend = () => {
    // Calculate recommended rate for 8 weeks
    const recommendedRate = Math.round((weightDifference / 8) * 10) / 10;
    // Clamp between 0.1 and 1.5
    const clampedRate = Math.max(0.1, Math.min(1.5, recommendedRate));
    setWeeklyRate(clampedRate);
    setShowRecommendation(true);
    
    // Hide recommendation after 3 seconds
    setTimeout(() => setShowRecommendation(false), 3000);
  };

  const handleNext = () => {
    updateData({ weeklyWeightLoss: weeklyRate });
    setCurrentStep(10);
    navigate('/onboarding/results');
  };

  // Determine which icon to highlight based on rate
  const getIconOpacity = (position: 'slow' | 'moderate' | 'fast') => {
    if (position === 'slow' && weeklyRate < 0.6) return 1;
    if (position === 'moderate' && weeklyRate >= 0.6 && weeklyRate <= 1.1) return 1;
    if (position === 'fast' && weeklyRate > 1.1) return 1;
    return 0.3;
  };

  return (
    <OnboardingLayout
      title="How fast would you like to achieve your goal?"
      subtitle="We'll help you find a healthy pace."
    >
      <div className="bg-card rounded-2xl p-6 shadow-md border border-border space-y-6">
        {/* Animal Icons */}
        <div className="flex justify-between items-center px-4">
          <div className="flex flex-col items-center transition-opacity duration-300" style={{ opacity: getIconOpacity('slow') }}>
            <Snail className="h-8 w-8 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Slow</span>
          </div>
          <div className="flex flex-col items-center transition-all duration-300" style={{ opacity: getIconOpacity('moderate') }}>
            <Rabbit className={`h-10 w-10 mb-1 ${getIconOpacity('moderate') === 1 ? 'text-primary' : 'text-muted-foreground'} ${showRecommendation && getIconOpacity('moderate') === 1 ? 'animate-bounce' : ''}`} />
            <span className={`text-xs ${getIconOpacity('moderate') === 1 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>Moderate</span>
          </div>
          <div className="flex flex-col items-center transition-opacity duration-300" style={{ opacity: getIconOpacity('fast') }}>
            <Bird className="h-8 w-8 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Fast</span>
          </div>
        </div>

        {/* Main Value Display */}
        <div className="text-center py-2">
          <p className="text-4xl font-bold text-primary mb-1">{weeklyRate.toFixed(1)} kg</p>
          <p className="text-sm text-muted-foreground">Weight change per week</p>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={[weeklyRate * 10]}
            onValueChange={(vals) => {
              setWeeklyRate(vals[0] / 10);
              setShowRecommendation(false);
            }}
            max={15}
            min={1}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0.1 kg/week</span>
            <span>1.5 kg/week</span>
          </div>
        </div>

        {/* Recommend Button */}
        <Button
          variant="outline"
          onClick={handleRecommend}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Recommend a healthy pace
        </Button>

        {/* Recommendation Feedback */}
        {showRecommendation && (
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            <p className="text-center text-sm font-medium text-foreground relative z-10">
              ✨ We recommend 8 weeks for safe, steady progress.
            </p>
          </div>
        )}
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
