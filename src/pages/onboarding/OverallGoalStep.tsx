import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { TrendingDown, Activity, TrendingUp } from 'lucide-react';

const goals = [
  { value: 'lose', label: 'Lose weight', icon: TrendingDown },
  { value: 'maintain', label: 'Lean gains & maintain', icon: Activity },
  { value: 'build', label: 'Build muscle', icon: TrendingUp },
];

export default function OverallGoalStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState(data.overallGoal || '');
  const navigate = useNavigate();

  const handleNext = () => {
    updateData({ overallGoal: selected });
    
   
      setCurrentStep(7);
      navigate('/onboarding/weight-goal');
 
    
  };

  return (
    <OnboardingLayout
      title="What's your main focus right now?"
      subtitle="Choose what matters most to you."
    >
      <div className="space-y-3">
        {goals.map((goal) => (
          <Button
            key={goal.value}
            variant="card"
            onClick={() => setSelected(goal.value)}
            className={selected === goal.value ? 'border-primary bg-primary/5' : ''}
          >
            <goal.icon className="mr-2 h-5 w-5" />
            {goal.label}
          </Button>
        ))}
      </div>

      <NavigationButtons onNext={handleNext} nextDisabled={!selected} />
    </OnboardingLayout>
  );
}
