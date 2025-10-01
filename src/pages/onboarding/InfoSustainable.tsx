import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { TrendingUp, Activity } from 'lucide-react';

export default function InfoSustainable() {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep(4);
    navigate('/onboarding/measurements');
  };

  return (
    <OnboardingLayout
      title="NutriWise creates longer-term results"
      subtitle="Sustainable nutrition beats quick fixes every time."
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Sustainable Results</h3>
            <p className="text-muted-foreground">Build healthy habits that last, not temporary fixes.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-destructive/10 rounded-full p-3">
            <Activity className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Not Yo-Yo Diets</h3>
            <p className="text-muted-foreground">Avoid the cycle of weight loss and regain.</p>
          </div>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <p className="text-center text-sm font-medium text-foreground">
            Our personalised approach helps you achieve lasting change
          </p>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} nextLabel="Sounds good →" />
    </OnboardingLayout>
  );
}
