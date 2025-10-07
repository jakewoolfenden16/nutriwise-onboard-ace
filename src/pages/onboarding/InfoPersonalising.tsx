import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Brain } from 'lucide-react';

const messages = [
  'Calculating your calories…',
  'Balancing your macros…',
  'Building your personalised meal plan…',
  'Analyzing your preferences…',
  'Optimizing your nutrition…',
];

export default function InfoPersonalising() {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  // Cycle through messages every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Show button after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setCurrentStep(16);
    navigate('/onboarding/meals');
  };

  return (
    <OnboardingLayout
      title="Thanks for trusting us."
      subtitle="We're working hard on your plan in the background…"
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-8">
        {/* AI Brain Working Illustration */}
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Outer glow ring - pulses */}
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse scale-125" />
            
            {/* Middle rotating glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            
            {/* Brain icon container */}
            <div className="relative bg-primary/10 rounded-full p-8">
              <Brain className="h-20 w-20 text-primary animate-pulse" style={{ animationDuration: '2s' }} />
            </div>
            
            {/* Orbiting dots (neurons/circuits) */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-primary rounded-full animate-ping" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2 w-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>

        {/* Dynamic Cycling Message */}
        <div className="text-center min-h-[60px] flex items-center justify-center">
          <p 
            key={currentMessageIndex}
            className="text-lg font-medium text-primary animate-fade-in"
          >
            {messages[currentMessageIndex]}
          </p>
        </div>
      </div>

      {/* Delayed Continue Button */}
      {showButton && (
        <div className="animate-fade-in">
          <NavigationButtons onNext={handleNext} nextLabel="Continue" hideBack />
        </div>
      )}
    </OnboardingLayout>
  );
}
