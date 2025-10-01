import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Slider } from '@/components/ui/slider';

export default function WorkoutStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [value, setValue] = useState(data.workoutFrequency || 3);
  const navigate = useNavigate();

  const handleNext = () => {
    updateData({ workoutFrequency: value });
    setCurrentStep(3);
    navigate('/onboarding/info-sustainable');
  };

  return (
    <OnboardingLayout
      title="How many times do you usually work out each week?"
      subtitle="Don't worry, walking counts too."
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
        <div className="text-center mb-8">
          <div className="inline-block bg-primary/10 rounded-2xl px-8 py-4 mb-4">
            <p className="text-6xl font-bold text-primary animate-bounce-in">{value}</p>
          </div>
          <p className="text-muted-foreground">times per week</p>
        </div>

        <Slider
          value={[value]}
          onValueChange={(vals) => setValue(vals[0])}
          max={14}
          min={0}
          step={1}
          className="mb-4"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>7</span>
          <span>14</span>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
