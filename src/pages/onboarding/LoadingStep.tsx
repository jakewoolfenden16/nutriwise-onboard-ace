import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { generateMealPlan } from '@/lib/api';
import { Sparkles, CheckCircle2, Loader2, Mail } from 'lucide-react';

const loadingSteps = [
  { label: 'Analyzing your profile...', duration: 2000 },
  { label: 'Calculating nutrition targets...', duration: 3000 },
  { label: 'Selecting recipes...', duration: 8000 },
  { label: 'Customizing your meals...', duration: 10000 },
  { label: 'Optimizing your plan...', duration: 15000 },
  { label: 'Finalizing everything...', duration: 20000 },
];

export default function LoadingStep() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'verified' | 'not-verified'>('checking');

  const { setCurrentStep } = useOnboarding();
  const { user, checkSession } = useAuth();
  const navigate = useNavigate();

  // Handle email verification on mount
  useEffect(() => {
    const handleEmailVerification = async () => {
      console.log('🔍 Checking for email verification...');
      
      // Check URL for Supabase auth tokens
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      const errorDescription = hashParams.get('error_description');

      // Handle error from Supabase
      if (errorDescription) {
        console.error('❌ Supabase auth error:', errorDescription);
        setError('Email verification failed. Please try signing up again.');
        setIsVerifying(false);
        setVerificationStatus('not-verified');
        return;
      }

      // If we have tokens from email verification
      if (type === 'signup' && accessToken) {
        console.log('✅ Email verification detected!');
        
        try {
          // Store tokens in localStorage
          localStorage.setItem('authToken', accessToken);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);

          console.log('✅ Tokens stored');
          console.log('📋 Questionnaire data will be retrieved from backend');
          
          // Refresh auth session if your context supports it
          if (checkSession) {
            await checkSession();
          }

          setVerificationStatus('verified');
          setIsVerifying(false);
          
          console.log('✅ Email verified! Ready to generate meal plan...');
          
        } catch (err) {
          console.error('❌ Failed to process verification:', err);
          setError('Failed to complete verification. Please try logging in.');
          setIsVerifying(false);
          setVerificationStatus('not-verified');
        }
      } 
      // Check if user is already authenticated
      else if (user || localStorage.getItem('authToken')) {
        console.log('✅ User already authenticated');
        setVerificationStatus('verified');
        setIsVerifying(false);
      }
      // No tokens and no user - need to verify email first
      else {
        console.log('⏳ Waiting for email verification...');
        setVerificationStatus('not-verified');
        setIsVerifying(false);
      }
    };

    handleEmailVerification();
  }, [user, checkSession]);

  // Start meal plan generation after verification
  useEffect(() => {
    if (verificationStatus !== 'verified') return;

    console.log('🎨 LoadingStep - Starting meal plan generation from metadata');
    
    const generatePlan = async () => {
      try {
        console.log('📤 Calling generate_meal_plan endpoint...');

        // Call the simplified API - no data needed, backend fetches from metadata
        const result = await generateMealPlan();
        
        console.log('✅ Meal plan generation completed:', result);

        // Set the meal plan from the response
        if (result.meal_plan) {
          setMealPlan(result.meal_plan);
        }

        // Mark all steps as complete
        setCompletedSteps(loadingSteps.map((_, i) => i));
        setProgress(100);

        // Wait a moment to show completion, then navigate
        setTimeout(() => {
          console.log('➡️ Navigating to meal plan view');
          setCurrentStep(23);
          navigate('/onboarding/meal-plan-view');
        }, 1500);

      } catch (err) {
        console.error('❌ Failed to generate meal plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate meal plan');
      }
    };

    generatePlan();
  }, [verificationStatus]);

  // Simulate progress while waiting for API
  useEffect(() => {
    if (error || mealPlan || verificationStatus !== 'verified') return;

    const totalDuration = loadingSteps[loadingSteps.length - 1].duration;
    const updateInterval = 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (totalDuration / updateInterval));
        return Math.min(newProgress, 95);
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [error, mealPlan, verificationStatus]);

  // Update current step based on progress
  useEffect(() => {
    if (error || mealPlan || verificationStatus !== 'verified') return;

    const totalDuration = loadingSteps[loadingSteps.length - 1].duration;
    
    loadingSteps.forEach((step, index) => {
      const stepProgress = (step.duration / totalDuration) * 100;
      if (progress >= stepProgress && !completedSteps.includes(index)) {
        setCurrentStepIndex(index);
        if (index > 0) {
          setCompletedSteps((prev) => [...prev, index - 1]);
        }
      }
    });
  }, [progress, error, mealPlan, verificationStatus]);

  // Show waiting for verification screen
  if (verificationStatus === 'not-verified' && !error) {
    return (
      <OnboardingLayout
        title="Check your email"
        subtitle="We sent you a verification link"
        hideProgress
      >
        <div className="space-y-6">
          {/* Email Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />
              <div className="relative bg-gradient-to-br from-primary to-accent rounded-full p-6">
                <Mail className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-card rounded-xl p-6 border border-border space-y-4">
            <h3 className="font-semibold text-lg text-center">Almost there!</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">1.</span>
                <span>Check your email inbox for a verification link from us</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">2.</span>
                <span>Click the verification link in the email</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">3.</span>
                <span>You'll be automatically brought back here to generate your meal plan</span>
              </p>
            </div>
          </div>

          {/* Additional info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-center text-muted-foreground">
              📧 Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => navigate('/onboarding/account')}
                className="text-primary hover:underline font-medium"
              >
                try signing up again
              </button>
            </p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  // Show checking verification status
  if (isVerifying) {
    return (
      <OnboardingLayout
        title="Verifying your email"
        subtitle="Please wait a moment..."
        hideProgress
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Checking verification status...</p>
        </div>
      </OnboardingLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <OnboardingLayout
        title="Oops! Something went wrong"
        subtitle="We couldn't generate your meal plan"
        hideProgress
      >
        <div className="space-y-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-sm text-destructive mb-4">{error}</p>
            <button
              onClick={() => navigate('/onboarding/account')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  // Show meal plan generation in progress
  return (
    <OnboardingLayout
      title="Creating your personalized meal plan"
      subtitle="Our AI is crafting something special just for you"
      hideProgress
    >
      <div className="space-y-8">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />
            <div className="relative bg-gradient-to-br from-primary to-accent rounded-full p-6">
              <Sparkles className="h-12 w-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-3">
          {loadingSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-primary/10 border border-primary/20'
                    : isCompleted
                    ? 'bg-card border border-border'
                    : 'bg-card/50 border border-border/50 opacity-50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 text-primary flex-shrink-0 animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-border flex-shrink-0" />
                )}
                <span className={`text-sm ${isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Fun Facts */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground text-center">
            💡 <span className="font-medium text-foreground">Did you know?</span> Your personalized plan considers over 50 factors including your goals, preferences, and lifestyle!
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}