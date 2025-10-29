import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ScrollPicker } from '@/components/ui/scroll-picker';

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
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
        <p className="text-center text-sm text-muted-foreground mb-4">Age</p>
        <ScrollPicker
          value={age}
          onChange={setAge}
          min={16}
          max={80}
          step={1}
          suffix=" years"
        />
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
