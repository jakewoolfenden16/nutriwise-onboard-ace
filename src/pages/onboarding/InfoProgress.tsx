import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Target } from 'lucide-react';

export default function InfoProgress() {
  const { data, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  
  const currentWeight = data.weight || 70;
  const goalWeight = data.weightGoal || 65;
  const difference = Math.abs(currentWeight - goalWeight);
  const unit = data.weightUnit || 'kg';

  const handleNext = () => {
    setCurrentStep(9);
    navigate('/onboarding/goal-speed');
  };

  return (
    <OnboardingLayout
      title="Your journey ahead"
      subtitle="Let's visualise your progress."
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-6">
        <div className="flex items-center justify-center">
          <Target className="h-16 w-16 text-primary" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-secondary rounded-xl">
            <span className="text-muted-foreground">Current</span>
            <span className="font-bold text-lg">{currentWeight}{unit}</span>
          </div>

          <div className="flex items-center justify-center">
            <div className="h-12 w-px bg-border" />
          </div>

          <div className="flex justify-between items-center p-4 bg-primary/10 rounded-xl border border-primary/20">
            <span className="text-muted-foreground">Goal</span>
            <span className="font-bold text-lg text-primary">{goalWeight}{unit}</span>
          </div>
        </div>

        <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
          <p className="text-center font-medium text-foreground">
            Losing <span className="text-primary font-bold">{difference.toFixed(1)}{unit}</span> is a realistic target
            <br />
            <span className="text-sm text-muted-foreground">— you've got this.</span>
          </p>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} nextLabel="Let's continue →" />
    </OnboardingLayout>
  );
}
