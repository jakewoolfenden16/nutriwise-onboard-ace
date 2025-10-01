import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const speedLabels = ['Very slow', 'Slow', 'Moderate', 'Fast', 'Very fast'];

export default function GoalSpeedStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [speed, setSpeed] = useState(data.goalSpeed || 2);
  const navigate = useNavigate();

  const handleRecommend = () => {
    setSpeed(2);
  };

  const handleNext = () => {
    updateData({ goalSpeed: speed });
    setCurrentStep(10);
    navigate('/onboarding/info-comparison');
  };

  return (
    <OnboardingLayout
      title="How fast would you like to achieve your goal?"
      subtitle="We recommend a healthy, sustainable pace."
    >
      <div className="bg-card rounded-2xl p-6 shadow-md border border-border space-y-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary mb-2">{speedLabels[speed]}</p>
          <p className="text-sm text-muted-foreground">Your selected pace</p>
        </div>

        <Slider
          value={[speed]}
          onValueChange={(vals) => setSpeed(vals[0])}
          max={4}
          min={0}
          step={1}
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow</span>
          <span>Fast</span>
        </div>

        <Button
          variant="outline"
          onClick={handleRecommend}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Recommend a healthy pace
        </Button>

        {speed === 2 && (
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 animate-fade-in">
            <p className="text-center text-sm font-medium text-foreground">
              Perfect! A moderate pace helps maintain muscle and energy levels.
            </p>
          </div>
        )}
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
