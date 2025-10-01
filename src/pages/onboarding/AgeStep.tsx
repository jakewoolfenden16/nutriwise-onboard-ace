import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Slider } from '@/components/ui/slider';

export default function AgeStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [age, setAge] = useState(data.age || 30);
  const navigate = useNavigate();

  const handleNext = () => {
    updateData({ age });
    setCurrentStep(6);
    navigate('/onboarding/weight-goal');
  };

  return (
    <OnboardingLayout
      title="How old are you?"
      subtitle="This helps us calculate your nutritional needs."
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
        <div className="text-center mb-8">
          <div className="inline-block bg-primary/10 rounded-2xl px-8 py-4 mb-4">
            <p className="text-6xl font-bold text-primary animate-bounce-in">{age}</p>
          </div>
          <p className="text-muted-foreground">years old</p>
        </div>

        <Slider
          value={[age]}
          onValueChange={(vals) => setAge(vals[0])}
          max={80}
          min={16}
          step={1}
          className="mb-4"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>16</span>
          <span>48</span>
          <span>80</span>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
