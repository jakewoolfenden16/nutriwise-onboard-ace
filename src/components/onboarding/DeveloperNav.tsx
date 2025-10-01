import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';

const steps = [
  { num: 1, name: 'Gender', path: '/onboarding/gender' },
  { num: 2, name: 'Workout Frequency', path: '/onboarding/workout' },
  { num: 3, name: 'Info: Sustainable Results', path: '/onboarding/info-sustainable' },
  { num: 4, name: 'Height & Weight', path: '/onboarding/measurements' },
  { num: 5, name: 'Age', path: '/onboarding/age' },
  { num: 6, name: 'Weight Goal', path: '/onboarding/weight-goal' },
  { num: 7, name: 'Overall Goal', path: '/onboarding/overall-goal' },
  { num: 8, name: 'Info: Progress Visual', path: '/onboarding/info-progress' },
  { num: 9, name: 'Goal Speed', path: '/onboarding/goal-speed' },
  { num: 10, name: 'Info: Comparison', path: '/onboarding/info-comparison' },
  { num: 11, name: 'Specific Diet', path: '/onboarding/diet' },
  { num: 12, name: 'Cuisine Preferences', path: '/onboarding/cuisine' },
  { num: 13, name: 'Foods to Avoid', path: '/onboarding/avoid' },
  { num: 14, name: 'Motivation', path: '/onboarding/motivation' },
  { num: 15, name: 'Info: Motivational', path: '/onboarding/info-motivational' },
  { num: 16, name: 'Info: Personalising', path: '/onboarding/info-personalising' },
  { num: 17, name: 'Meal Preferences', path: '/onboarding/meals' },
  { num: 18, name: 'Fasting', path: '/onboarding/fasting' },
  { num: 19, name: 'Loading', path: '/onboarding/loading' },
  { num: 20, name: 'Plan Ready', path: '/onboarding/results' },
  { num: 21, name: 'Account Creation', path: '/onboarding/account' },
  { num: 22, name: 'Payment', path: '/onboarding/payment' },
];

export const DeveloperNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { resetData, setCurrentStep } = useOnboarding();

  const handleStepClick = (step: number, path: string) => {
    setCurrentStep(step);
    navigate(path);
    setIsOpen(false);
  };

  const handleReset = () => {
    resetData();
    navigate('/onboarding/gender');
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-card border-2 border-primary text-card-foreground p-2 rounded-lg shadow-lg hover:bg-primary hover:text-primary-foreground transition-all"
        aria-label="Toggle developer navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Navigation Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-40 bg-card border-2 border-border rounded-lg shadow-2xl p-4 max-h-[80vh] overflow-y-auto w-80 animate-fade-in">
          <h3 className="text-lg font-bold mb-3 text-foreground">Developer Navigation</h3>
          
          <Button
            onClick={handleReset}
            variant="destructive"
            size="sm"
            className="w-full mb-4"
          >
            Reset Onboarding
          </Button>

          <div className="space-y-1">
            {steps.map((step) => (
              <button
                key={step.num}
                onClick={() => handleStepClick(step.num, step.path)}
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-secondary transition-colors flex items-center gap-2"
              >
                <span className="font-semibold text-primary">{step.num}.</span>
                <span className="text-foreground">{step.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
