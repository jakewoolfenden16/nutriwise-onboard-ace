import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Sparkles } from 'lucide-react';

export default function InfoComparison() {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep(11);
    navigate('/onboarding/diet');
  };

  return (
    <OnboardingLayout
      title="NutriWise users lose twice as much weight as with other apps."
      subtitle="Our personalised approach gets real results."
    >
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-8">
        {/* Before & After Comparison */}
        <div className="flex items-end justify-center gap-12">
          {/* Other Apps - Stick Figure */}
          <div className="text-center space-y-3">
            <div className="relative flex justify-center">
              <svg width="80" height="120" viewBox="0 0 80 120" className="opacity-60">
                {/* Head */}
                <circle cx="40" cy="20" r="12" fill="hsl(var(--muted-foreground))" opacity="0.5" />
                {/* Body */}
                <line x1="40" y1="32" x2="40" y2="70" stroke="hsl(var(--muted-foreground))" strokeWidth="3" opacity="0.5" />
                {/* Arms */}
                <line x1="40" y1="45" x2="25" y2="55" stroke="hsl(var(--muted-foreground))" strokeWidth="3" opacity="0.5" />
                <line x1="40" y1="45" x2="55" y2="55" stroke="hsl(var(--muted-foreground))" strokeWidth="3" opacity="0.5" />
                {/* Legs */}
                <line x1="40" y1="70" x2="30" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="3" opacity="0.5" />
                <line x1="40" y1="70" x2="50" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="3" opacity="0.5" />
              </svg>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Other Apps</p>
          </div>

          {/* NutriWise - Toned Silhouette */}
          <div className="text-center space-y-3">
            <div className="relative flex justify-center">
              {/* Sparkle Effects */}
              <Sparkles className="absolute -top-2 -left-2 h-5 w-5 text-primary animate-pulse" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Sparkles className="absolute top-10 -right-3 h-3 w-3 text-primary animate-pulse" style={{ animationDelay: '1s' }} />
              
              <svg width="80" height="120" viewBox="0 0 80 120" className="drop-shadow-lg">
                {/* Head */}
                <circle cx="40" cy="20" r="12" fill="hsl(var(--primary))" />
                {/* Torso - Athletic V-shape */}
                <path 
                  d="M 35 32 Q 32 45 30 55 L 30 68 Q 30 72 34 72 L 46 72 Q 50 72 50 68 L 50 55 Q 48 45 45 32 Q 42 30 40 30 Q 38 30 35 32 Z" 
                  fill="hsl(var(--primary))"
                />
                {/* Arms - Defined */}
                <ellipse cx="24" cy="50" rx="4" ry="12" fill="hsl(var(--primary))" transform="rotate(-20 24 50)" />
                <ellipse cx="56" cy="50" rx="4" ry="12" fill="hsl(var(--primary))" transform="rotate(20 56 50)" />
                {/* Legs - Toned */}
                <ellipse cx="35" cy="90" rx="5" ry="20" fill="hsl(var(--primary))" />
                <ellipse cx="45" cy="90" rx="5" ry="20" fill="hsl(var(--primary))" />
                {/* Definition lines */}
                <line x1="40" y1="45" x2="40" y2="58" stroke="hsl(var(--primary-foreground))" strokeWidth="1" opacity="0.3" />
              </svg>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-primary">NutriWise</p>
              <div className="flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold text-primary">2× Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <p className="text-center text-sm font-medium text-foreground">
            Personalised plans that adapt to your lifestyle and goals
          </p>
        </div>
      </div>

      <NavigationButtons onNext={handleNext} nextLabel="Show me how" />
    </OnboardingLayout>
  );
}
