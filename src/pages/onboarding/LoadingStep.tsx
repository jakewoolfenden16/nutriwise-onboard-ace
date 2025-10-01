import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Loader2 } from 'lucide-react';

const messages = [
  { progress: 0, text: 'Starting your personalised plan...' },
  { progress: 20, text: 'Crunching the numbers...' },
  { progress: 40, text: 'Analysing your goals...' },
  { progress: 60, text: 'Personalising your macros...' },
  { progress: 80, text: 'Building your meal plan...' },
  { progress: 90, text: 'Almost there — your plan is ready!' },
  { progress: 100, text: 'Complete! 🎉' },
];

export default function LoadingStep() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const navigate = useNavigate();
  const { setCurrentStep } = useOnboarding();

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const increment = (100 * interval) / duration;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + increment, 100);
        
        const currentMessage = messages.findIndex(m => m.progress > next) - 1;
        if (currentMessage !== messageIndex && currentMessage >= 0) {
          setMessageIndex(currentMessage);
        }

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setCurrentStep(20);
            navigate('/onboarding/results');
          }, 500);
        }

        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [navigate, setCurrentStep, messageIndex]);

  return (
    <OnboardingLayout title="Creating your plan" hideProgress>
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-8">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="bg-primary/10 rounded-full p-8">
              <Loader2 className="h-20 w-20 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="text-xl font-semibold text-foreground animate-fade-in">
            {messages[messageIndex]?.text}
          </p>
        </div>

        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </OnboardingLayout>
  );
}
