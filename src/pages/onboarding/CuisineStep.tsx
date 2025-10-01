import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';

const cuisines = ['Indian', 'Mediterranean', 'Asian', 'Japanese', 'Italian', 'Mexican'];

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
    navigate('/onboarding/avoid');
  };

  return (
    <OnboardingLayout
      title="Do you have cuisine preferences?"
      subtitle="We'll focus on flavours you love."
    >
      <div className="space-y-6">
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Any other notes for your AI dietitian?
          </label>
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
