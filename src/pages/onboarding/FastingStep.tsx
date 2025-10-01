import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Clock, Info } from 'lucide-react';

export default function FastingStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [fasting, setFasting] = useState(data.fasting ?? false);
  const navigate = useNavigate();

  const handleNext = () => {
    updateData({ fasting });
    setCurrentStep(19);
    navigate('/onboarding/loading');
  };

  return (
    <OnboardingLayout
      title="Do you fast or prefer to skip breakfast?"
      subtitle="Some people feel better with intermittent fasting."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="card"
            onClick={() => setFasting(true)}
            className={fasting ? 'border-primary bg-primary/5' : ''}
          >
            Yes
          </Button>
          <Button
            variant="card"
            onClick={() => setFasting(false)}
            className={!fasting ? 'border-primary bg-primary/5' : ''}
          >
            No
          </Button>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-md border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Benefits of fasting</h3>
          </div>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <span>May improve insulin sensitivity and metabolic health</span>
            </li>
            <li className="flex items-start gap-2">
              <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <span>Can help with weight management and fat loss</span>
            </li>
            <li className="flex items-start gap-2">
              <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <span>May enhance focus and mental clarity</span>
            </li>
          </ul>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
