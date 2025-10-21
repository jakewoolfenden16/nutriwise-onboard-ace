import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';

const cuisines = ['Indian', 'Mediterranean', 'Asian', 'Japanese', 'Italian', 'Mexican'];
const SHOW_CUISINE_BUTTONS = false; // TODO: Enable when backend is connected

export default function CuisineStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(data.cuisinePreferences || []);
  const [notes, setNotes] = useState(data.otherNotes || '');
  const navigate = useNavigate();

  const toggleCuisine = (cuisine: string) => {
    setSelected(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleNext = () => {
    updateData({ cuisinePreferences: selected, otherNotes: notes });
    setCurrentStep(13);
    navigate('/onboarding/account');
  };

  return (
    <OnboardingLayout
      title="What foods do you love?"
      subtitle="In your own words, tell us about cuisines, ingredients, or dishes you enjoy."
    >
      <div className="space-y-6">
      {SHOW_CUISINE_BUTTONS && (
        <div className="grid grid-cols-2 gap-3">
          {cuisines.map((cuisine) => (
            <Button
              key={cuisine}
              variant="card"
              onClick={() => toggleCuisine(cuisine)}
              className={`relative ${selected.includes(cuisine) ? 'border-primary bg-primary/5' : ''}`}
            >
              {cuisine}
              {selected.includes(cuisine) && (
                <Check className="absolute top-2 right-2 h-5 w-5 text-primary" />
              )}
            </Button>
          ))}
        </div>
      )}
        <div className="space-y-2">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., I prefer low-carb meals, love spicy food..."
            className="min-h-24 resize-none"
          />
        </div>
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
