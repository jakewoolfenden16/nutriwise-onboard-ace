import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Leaf, Fish, Salad, Utensils } from 'lucide-react';

const diets = [
  { value: 'vegan', label: 'Vegan', icon: Leaf },
  { value: 'vegetarian', label: 'Vegetarian', icon: Salad },
  { value: 'pescatarian', label: 'Pescatarian', icon: Fish },
  { value: 'none', label: 'None', icon: Utensils },
];

export default function DietStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState(data.specificDiet || '');
  const navigate = useNavigate();

  const handleNext = () => {
    updateData({ specificDiet: selected });
    setCurrentStep(12);
    navigate('/onboarding/cuisine');
  };

  return (
    <OnboardingLayout
      title="Do you follow a specific diet?"
      subtitle="This helps us avoid foods you can't eat."
    >
      <div className="space-y-3">
        {diets.map((diet) => (
          <Button
            key={diet.value}
            variant="card"
            onClick={() => setSelected(diet.value)}
            className={selected === diet.value ? 'border-primary bg-primary/5' : ''}
          >
            <diet.icon className="mr-2 h-5 w-5" />
            {diet.label}
          </Button>
        ))}
      </div>

      <NavigationButtons onNext={handleNext} nextDisabled={!selected} />
    </OnboardingLayout>
  );
}
