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
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-8">
        {/* Icon Section */}
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 rounded-full p-6">
            <Target className="h-16 w-16 text-primary" />
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Losing <span className="text-primary">{difference.toFixed(1)}{unit}</span> is a realistic target
          </h2>
          <p className="text-lg text-muted-foreground">You've got this.</p>
        </div>

        {/* Progress Bar Visualization */}
        <div className="space-y-3">
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-orange-500 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Current</span>
            <span className="text-primary font-bold">Goal: -{difference.toFixed(1)}{unit}</span>
          </div>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} nextLabel="Let's do it" />
    </OnboardingLayout>
  );
}
