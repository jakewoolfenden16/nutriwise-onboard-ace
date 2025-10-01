import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Confetti } from '@/components/onboarding/Confetti';
import { Award, Zap, Target, TrendingUp } from 'lucide-react';

export default function ResultsStep() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { data, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const goalWeight = data.weightGoal || 65;
  const currentWeight = data.weight || 70;
  const difference = Math.abs(currentWeight - goalWeight);

  const calories = 2100;
  const protein = 150;
  const carbs = 200;
  const fat = 70;

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const handleNext = () => {
    setCurrentStep(21);
    navigate('/onboarding/account');
  };

  const tips = [
    'Drink 8 glasses of water daily for optimal hydration',
    'Include protein with every meal to support muscle recovery',
    'Aim for 7-9 hours of quality sleep each night',
    'Track your progress weekly, not daily, to see trends',
  ];

  return (
    <>
      {showConfetti && <Confetti />}
      <OnboardingLayout
        title="Congratulations! Your personalised plan is ready"
        subtitle="Here's what we've created for you."
        hideProgress
      >
        <div className="space-y-6">
          {/* Main Stats Card */}
          <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 shadow-lg text-primary-foreground">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Daily Targets</h3>
              <Award className="h-6 w-6" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <p className="text-3xl font-bold">{calories}</p>
                <p className="text-sm opacity-90">Calories</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <p className="text-3xl font-bold">{protein}g</p>
                <p className="text-sm opacity-90">Protein</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <p className="text-3xl font-bold">{carbs}g</p>
                <p className="text-sm opacity-90">Carbs</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <p className="text-3xl font-bold">{fat}g</p>
                <p className="text-sm opacity-90">Fat</p>
              </div>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Your Health Score</h3>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-primary">7.8</p>
              <p className="text-muted-foreground mb-1">/10</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Great foundation! You're on track to reach {goalWeight}{data.weightUnit || 'kg'}.
            </p>
          </div>

          {/* Personalised Tips */}
          <div className="bg-card rounded-2xl p-6 shadow-md border border-border space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Personalised Tips</h3>
            </div>
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-secondary rounded-xl">
                <TrendingUp className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>All recommendations based on latest nutritional research</p>
          </div>
        </div>

        <NavigationButtons onNext={handleNext} nextLabel="Let's get started →" hideBack />
      </OnboardingLayout>
    </>
  );
}
