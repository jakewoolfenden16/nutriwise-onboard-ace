import { useOnboarding } from '@/contexts/OnboardingContext';

const steps = [
  { step: 1, label: "Great start!" },
  { step: 3, label: "You're doing amazing!" },
  { step: 6, label: "Halfway there 🚀" },
  { step: 9, label: "You're flying through this!" },
  { step: 12, label: "Almost there!" },
  { step: 15, label: "Final stretch!" },
  { step: 18, label: "Nearly done!" },
  { step: 20, label: "Your plan is nearly ready!" },
];

const getMotivationalText = (step: number) => {
  const milestone = steps.reverse().find(s => step >= s.step);
  return milestone ? milestone.label : "Let's get started!";
};

export const ProgressBar = () => {
  const { currentStep } = useOnboarding();
  const totalSteps = 22;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-muted-foreground font-medium">
          {currentStep} of {totalSteps}
        </p>
        <p className="text-sm text-primary font-medium animate-slide-up">
          {getMotivationalText(currentStep)}
        </p>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out origin-left"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
