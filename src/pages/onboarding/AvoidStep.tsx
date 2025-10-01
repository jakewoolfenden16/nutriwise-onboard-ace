import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

const commonFoods = ['Tomatoes', 'Fish', 'Dairy', 'Nuts', 'Gluten', 'Eggs'];

export default function AvoidStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(data.foodsToAvoid || []);
  const [customFood, setCustomFood] = useState('');
  const navigate = useNavigate();

  const toggleFood = (food: string) => {
    setSelected(prev =>
      prev.includes(food)
        ? prev.filter(f => f !== food)
        : [...prev, food]
    );
  };

  const addCustomFood = () => {
    if (customFood.trim() && !selected.includes(customFood.trim())) {
      setSelected(prev => [...prev, customFood.trim()]);
      setCustomFood('');
    }
  };

  const handleNext = () => {
    updateData({ foodsToAvoid: selected });
    setCurrentStep(14);
    navigate('/onboarding/motivation');
  };

  return (
    <OnboardingLayout
      title="Is there anything you'd like to avoid?"
      subtitle="We'll make sure to skip it."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {commonFoods.map((food) => (
            <Button
              key={food}
              variant="card"
              onClick={() => toggleFood(food)}
              className={`relative ${selected.includes(food) ? 'border-primary bg-primary/5' : ''}`}
            >
              {food}
              {selected.includes(food) && (
                <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                  <X className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </Button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 bg-secondary rounded-xl">
            {selected.filter(f => !commonFoods.includes(f)).map((food) => (
              <div
                key={food}
                className="flex items-center gap-1 bg-card px-3 py-1 rounded-full border border-border"
              >
                <span className="text-sm">{food}</span>
                <button
                  onClick={() => toggleFood(food)}
                  className="hover:bg-destructive/10 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={customFood}
            onChange={(e) => setCustomFood(e.target.value)}
            placeholder="Add custom food to avoid..."
            onKeyPress={(e) => e.key === 'Enter' && addCustomFood()}
          />
          <Button onClick={addCustomFood} size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
