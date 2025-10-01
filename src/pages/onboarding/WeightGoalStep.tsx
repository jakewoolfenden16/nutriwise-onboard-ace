import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';

export default function WeightGoalStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const currentWeight = data.weight || 70;
  const weightUnit = data.weightUnit || 'kg';
  const [goalWeight, setGoalWeight] = useState(data.weightGoal || currentWeight - 5);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const difference = Math.abs(currentWeight - goalWeight);
  const isLoss = goalWeight < currentWeight;

  const min = weightUnit === 'kg' ? 40 : 88;
  const max = weightUnit === 'kg' ? 150 : 330;
  const step = 0.1;

  // Generate tick marks
  const ticks = [];
  for (let i = min; i <= max; i += (weightUnit === 'kg' ? 5 : 10)) {
    ticks.push(i);
  }

  const handleNext = () => {
    updateData({ weightGoal: goalWeight });
    setCurrentStep(7);
    navigate('/onboarding/overall-goal');
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const value = min + percentage * (max - min);
    const rounded = Math.round(value / step) * step;
    setGoalWeight(Number(rounded.toFixed(1)));
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

        {/* Ruler-style slider */}
        <div className="py-8">
          <div
            ref={containerRef}
            className="relative h-24 bg-secondary/30 rounded-xl cursor-pointer select-none"
            onMouseDown={(e) => {
              setIsDragging(true);
              handleDrag(e);
            }}
            onMouseMove={handleDrag}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleDrag(e);
            }}
            onTouchMove={handleDrag}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Tick marks */}
            {ticks.map((tick) => {
              const percentage = ((tick - min) / (max - min)) * 100;
              const isMajor = tick % (weightUnit === 'kg' ? 10 : 20) === 0;
              
              return (
                <div
                  key={tick}
                  className="absolute bottom-0"
                  style={{ left: `${percentage}%` }}
                >
                  <div className={cn(
                    "w-0.5 bg-muted-foreground/40",
                    isMajor ? "h-8" : "h-4"
                  )} />
                  {isMajor && (
                    <span className="absolute top-10 -translate-x-1/2 text-xs text-muted-foreground">
                      {tick}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Current value indicator */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-primary rounded-full transition-all duration-100"
              style={{ left: `${((goalWeight - min) / (max - min)) * 100}%` }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg" />
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <p className="text-center text-sm font-medium text-foreground">
            Based on your goal, you'd be {isLoss ? 'down' : 'up'}{' '}
            <span className="text-primary font-bold">{difference.toFixed(1)} {weightUnit}</span>
            {' '}— that's achievable!
          </p>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
