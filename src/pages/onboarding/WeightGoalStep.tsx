import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Slider } from '@/components/ui/slider';

export default function WeightGoalStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const currentWeight = data.weight || 70;
  const weightUnit = data.weightUnit || 'kg';
  const [goalWeight, setGoalWeight] = useState(data.weightGoal || currentWeight - 5);
  const navigate = useNavigate();

  const difference = Math.abs(currentWeight - goalWeight);
  const isLoss = goalWeight < currentWeight;

  const handleNext = () => {
    updateData({ weightGoal: goalWeight });
    setCurrentStep(7);
    navigate('/onboarding/overall-goal');
  };

  return (
    <OnboardingLayout
      title="What weight would you like to be?"
      subtitle="Let's set a realistic target."
    >
      <div className="bg-card rounded-2xl p-6 shadow-md border border-border space-y-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-primary mb-2">
            {goalWeight.toFixed(1)} {weightUnit}
          </p>
          <p className="text-muted-foreground">Your goal weight</p>
        </div>

        <Slider
          value={[goalWeight]}
          onValueChange={(vals) => setGoalWeight(vals[0])}
          max={weightUnit === 'kg' ? 150 : 330}
          min={weightUnit === 'kg' ? 40 : 88}
          step={0.1}
        />

        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <p className="text-center text-sm font-medium text-foreground">
            Based on your goal, you'd be {isLoss ? 'down' : 'up'}{' '}
            <span className="text-primary font-bold">{difference.toFixed(1)}{weightUnit}</span>
            {' '}— that's achievable!
          </p>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
