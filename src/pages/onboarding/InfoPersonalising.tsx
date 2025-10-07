import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Brain } from 'lucide-react';

const BASE_MESSAGES = [
  'Calculating your calories…',
  'Balancing your macros…',
  'Building your personalised meal plan…',
  'Analyzing your preferences…',
  'Optimizing your nutrition…',
] as const;

const STEP_DURATION_MS = 1000;

export default function InfoPersonalising() {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [justEnabled, setJustEnabled] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();
  const messages = useMemo(() => BASE_MESSAGES, []);
  const timerRef = useRef<number | null>(null);

  // advance through messages once
  useEffect(() => {
    if (done) return;
    if (index >= messages.length - 1) {
      setDone(true);
      return;
    }
    timerRef.current = window.setTimeout(() => setIndex(i => i + 1), STEP_DURATION_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
}, [index, done, messages.length, STEP_DURATION_MS]);

  // nudge when CTA enables
  useEffect(() => {
    if (!done) return;
    setJustEnabled(true);
    const t = setTimeout(() => setJustEnabled(false), 1000);
    return () => clearTimeout(t);
  }, [done]);

  // keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!done) return;
      if (e.key === 'Enter' || e.key === ' ') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [done]);

  const handleNext = () => {
    setCurrentStep(16);
    navigate('/onboarding/meals');
  };

  const loaderAnimated = !done && !prefersReducedMotion;
  const title = done ? 'Your plan is ready.' : 'Thanks for trusting us.';
  const subtitle = done
    ? 'All set — continue to see your personalised plan.'
    : "We're working hard on your plan in the background…";

  return (
    <OnboardingLayout title={title} subtitle={subtitle}>
      <div className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-8">
        {/* Loader */}
        <div className="flex items-center justify-center">
          <div
            className={`relative ${done ? 'opacity-80' : ''}`}
            role="img"
            aria-label="AI is preparing your personalised meal plan"
          >
            {/* Outer glow ring */}
            {loaderAnimated && (
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse scale-125" />
            )}
            {/* Middle rotating glow */}
            {loaderAnimated && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full animate-spin"
                style={{ animationDuration: '3s' }}
              />
            )}
            {/* Brain icon */}
            <div className="relative bg-primary/10 rounded-full p-8">
              <Brain
                className={`h-20 w-20 text-primary ${loaderAnimated ? 'animate-pulse' : ''}`}
                style={{ animationDuration: '2s' }}
                aria-hidden="true"
              />
            </div>

            {/* Orbiting dots */}
            {loaderAnimated && (
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-primary rounded-full animate-ping" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2 w-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
              </div>
            )}
          </div>
        </div>

        {/* Status message */}
        <div
          className="text-center min-h-[60px] flex items-center justify-center"
          aria-live="polite"
        >
          <p key={index} className="text-lg font-medium text-primary animate-fade-in">
            {done ? 'Let\'s Go!' : messages[index]}
          </p>
        </div>
      </div>

      {/* Sticky CTA: visible from start, disabled until done */}
      <div className="mt-8 sticky bottom-4">
        <button
          onClick={handleNext}
          disabled={!done}
          className={[
            'w-full h-14 rounded-xl font-semibold shadow-md transition focus:outline-none focus:ring-2',
            done
              ? 'bg-primary text-primary-foreground hover:shadow-lg focus:ring-primary/40'
              : 'bg-muted text-muted-foreground cursor-not-allowed focus:ring-transparent',
            justEnabled ? 'animate-bounce' : '',
          ].join(' ')}
          {...(done ? { autoFocus: true } : {})}
        >
          {done ? 'Continue →' : 'Preparing…'}
        </button>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {done ? 'Press Enter to continue' : 'Please wait a moment'}
        </p>
      </div>
    </OnboardingLayout>
  );
}

/** Hook: prefers-reduced-motion */
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPRM] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPRM(media.matches);
    onChange();
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);
  return prefersReducedMotion;
}
