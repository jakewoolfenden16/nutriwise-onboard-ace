import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Award, TrendingUp } from 'lucide-react';

export default function InfoComparison() {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep(11);
    navigate('/onboarding/diet');
  };

  return (
    <OnboardingLayout
      title="NutriWise users lose twice as much"
      subtitle="Compared to other apps, our personalised approach works."
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-6">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="bg-muted rounded-xl p-6 mb-3">
              <p className="text-3xl font-bold text-muted-foreground">1×</p>
            </div>
            <p className="text-sm text-muted-foreground">Other apps</p>
          </div>

          <TrendingUp className="h-8 w-8 text-primary" />

          <div className="text-center">
            <div className="bg-primary/10 rounded-xl p-6 mb-3 border-2 border-primary">
              <p className="text-3xl font-bold text-primary">2×</p>
            </div>
            <p className="text-sm font-semibold text-foreground">NutriWise</p>
          </div>
        </div>

        <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
          <div className="flex items-center gap-2 justify-center">
            <Award className="h-5 w-5 text-accent" />
            <p className="text-center text-sm font-medium text-foreground">
              Personalised nutrition plans deliver better results
            </p>
          </div>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} nextLabel="Show me how →" />
    </OnboardingLayout>
  );
}
