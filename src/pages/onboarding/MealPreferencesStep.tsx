import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';

const meals = [
  'Breakfast',
  'Morning snack',
  'Lunch',
  'Afternoon snack',
  'Dinner',
];

export default function MealPreferencesStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(data.mealPreferences || ['Breakfast', 'Lunch', 'Dinner']);
  const navigate = useNavigate();

  const toggleMeal = (meal: string) => {
    setSelected(prev =>
      prev.includes(meal)
        ? prev.filter(m => m !== meal)
        : [...prev, meal]
    );
  };

  const handleNext = () => {
    updateData({ mealPreferences: selected });
    setCurrentStep(18);
    navigate('/onboarding/fasting');
  };

  return (
    <OnboardingLayout
      title="Which meals do you want to include?"
      subtitle="Tick as many as you like."
    >
      <div className="space-y-4">
        <div className="space-y-3">
          {meals.map((meal) => (
            <Button
              key={meal}
              variant="card"
              onClick={() => toggleMeal(meal)}
              className={`relative ${selected.includes(meal) ? 'border-primary bg-primary/5' : ''}`}
            >
              {meal}
              {selected.includes(meal) && (
                <Check className="absolute top-4 right-4 h-5 w-5 text-primary" />
              )}
            </Button>
          ))}
        </div>

        <div className="bg-accent/10 rounded-xl p-4 border border-accent/20 flex items-start gap-3">
          <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            The more meals you eat, the more balanced your nutrition throughout the day.
          </p>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} nextDisabled={selected.length === 0} />
    </OnboardingLayout>
  );
}
