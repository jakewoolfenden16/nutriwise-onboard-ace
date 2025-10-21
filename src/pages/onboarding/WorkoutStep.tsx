import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';

type WorkoutLevel = 'low' | 'medium' | 'high';

const workoutOptions = [
  { id: 'low' as WorkoutLevel, range: '0-2', label: 'Workouts now and then', value: 1 },
  { id: 'medium' as WorkoutLevel, range: '3-5', label: 'A few workouts per week', value: 4 },
  { id: 'high' as WorkoutLevel, range: '6+', label: 'Dedicated Athlete', value: 7 },
];

export default function WorkoutStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState<WorkoutLevel>(() => {
    const freq = data.workoutFrequency || 4;
    if (freq <= 2) return 'low';
    if (freq <= 5) return 'medium';
    return 'high';
  });
  const navigate = useNavigate();

  const handleNext = () => {
    const option = workoutOptions.find(o => o.id === selected);
    updateData({ workoutFrequency: option?.value || 4 });
    setCurrentStep(3);
    navigate('/onboarding/measurements');
  };

  return (
    <OnboardingLayout
      title="How many times do you usually work out each week?"
      subtitle="Don't worry, walking counts too."
    >
      <div className="space-y-4">
        {workoutOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={cn(
              "w-full bg-card rounded-2xl p-6 shadow-md border-2 transition-all duration-200",
              "hover:scale-[1.02] active:scale-[0.98]",
              selected === option.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="text-center">
              <p className={cn(
                "text-4xl font-bold mb-2 transition-colors",
                selected === option.id ? "text-primary" : "text-foreground"
              )}>
                {option.range}
              </p>
              <p className="text-muted-foreground">{option.label}</p>
            </div>
          </button>
        ))}
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
