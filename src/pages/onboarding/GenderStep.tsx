import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { User, Users } from 'lucide-react';

const genderOptions = [
  { value: 'male', label: 'Male', icon: User },
  { value: 'female', label: 'Female', icon: User },
  { value: 'other', label: 'Other', icon: Users },
  { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: Users },
];

export default function GenderStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState(data.gender || '');
  const navigate = useNavigate();

  const handleNext = () => {
    updateData({ gender: selected });
    setCurrentStep(2);
    navigate('/onboarding/workout');
  };

  return (
    <OnboardingLayout
      title="Let's start simple — what's your gender?"
      subtitle="This helps us tailor your nutrition plan."
    >
      <div className="grid grid-cols-1 gap-3">
        {genderOptions.map((option) => (
          <Button
            key={option.value}
            variant="card"
            onClick={() => setSelected(option.value)}
            className={selected === option.value ? 'border-primary bg-primary/5' : ''}
          >
            <option.icon className="mr-2 h-5 w-5" />
            {option.label}
          </Button>
        ))}
      </div>

      <NavigationButtons
        onNext={handleNext}
        nextDisabled={!selected}
        hideBack
      />
    </OnboardingLayout>
  );
}
