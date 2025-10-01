import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Rocket } from 'lucide-react';

export default function InfoMotivational() {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep(16);
    navigate('/onboarding/info-personalising');
  };

  return (
    <OnboardingLayout
      title="You've got great potential"
      subtitle="Ready to crush your goals?"
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-6">
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 rounded-full p-6">
            <Rocket className="h-20 w-20 text-primary" />
          </div>
        </div>

        <div className="space-y-3 text-center">
          <p className="text-xl font-semibold text-foreground">
            Your journey starts now
          </p>
          <p className="text-muted-foreground">
            With the right plan and commitment, you can achieve amazing results. Let's make it happen together.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['🎯', '💪', '🌟'].map((emoji, i) => (
            <div key={i} className="bg-primary/5 rounded-xl p-4 text-center border border-primary/20">
              <p className="text-3xl mb-2">{emoji}</p>
              <p className="text-xs text-muted-foreground">
                {['Focus', 'Strength', 'Success'][i]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <NavigationButtons onNext={handleNext} nextLabel="Go get it →" />
    </OnboardingLayout>
  );
}
