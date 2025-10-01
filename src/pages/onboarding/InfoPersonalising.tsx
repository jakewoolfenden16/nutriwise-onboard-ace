import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Sparkles } from 'lucide-react';

export default function InfoPersonalising() {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep(17);
    navigate('/onboarding/meals');
  };

  return (
    <OnboardingLayout
      title="Thanks for trusting us"
      subtitle="We're personalising your plan..."
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="bg-primary/10 rounded-full p-6 animate-pulse">
              <Sparkles className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          </div>
        </div>

        <div className="space-y-3 text-center">
          <p className="text-xl font-semibold text-foreground">
            Creating your personalised plan
          </p>
          <p className="text-muted-foreground">
            We're analysing your goals, preferences, and nutritional needs to create the perfect plan for you.
          </p>
        </div>

        <div className="space-y-2">
          {['Calculating your macros', 'Selecting suitable foods', 'Building your meal schedule'].map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-secondary rounded-xl animate-slide-up"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="h-2 w-2 bg-primary rounded-full" />
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <NavigationButtons onNext={handleNext} nextLabel="Continue →" />
    </OnboardingLayout>
  );
}
