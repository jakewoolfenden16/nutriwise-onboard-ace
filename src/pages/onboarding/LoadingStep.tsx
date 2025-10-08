import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { generateMealPlan, getCurrentMealPlan } from '@/lib/api';
import type { QuestionnaireData } from '@/lib/types';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

// Map frontend goal values to backend expected values
const mapGoalToBackend = (goal: string): string => {
  const goalMap: Record<string, string> = {
    'lose': 'Fat Loss',
    'build': 'Build Muscle',
    'maintain': 'General Health / Maintenance',
  };
  
  return goalMap[goal.toLowerCase()] || 'General Health / Maintenance';
};

const loadingSteps = [
  { label: 'Analyzing your profile...', duration: 12000 },         // 12 seconds
  { label: 'Calculating nutrition targets...', duration: 18000 },  // 18 seconds
  { label: 'Selecting recipes...', duration: 48000 },             // 48 seconds
  { label: 'Customizing your meals...', duration: 60000 },        // 60 seconds
  { label: 'Optimizing your plan...', duration: 90000 },         // 90 seconds
  { label: 'Finalizing everything...', duration: 120000 },       // 120 seconds
];

export default function LoadingStep() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<any>(null);

  const { data, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🎨 LoadingStep - Starting meal plan generation');
    
    // Start the actual API call
    const generatePlan = async () => {
      try {
        const mappedGoal = mapGoalToBackend(data.overallGoal || 'maintain');

        const requestData: QuestionnaireData = {
          gender: (data.gender || 'male') as 'male' | 'female',
          height: data.height || 0,
          age: data.age || 0,
          weight: data.weight || 0,
          workouts_per_week: data.workoutFrequency || 0,
          goal: mappedGoal,
          diet: data.specificDiet || 'balanced',
          additional_considerations: [
            ...(data.foodsToAvoid || []),
            ...(data.cuisinePreferences || []).map(c => `Prefers ${c} cuisine`),
            data.otherNotes || '',
          ].filter(Boolean).join(', '),
          weight_goal: data.weightGoal || 0,
          planned_weekly_weight_loss: data.weeklyWeightLoss || 0.5,
        };

        console.log('📤 Generating meal plan with:', requestData);

        const result = await generateMealPlan(requestData);
        
        console.log('✅ Meal plan generation started:', result);

        // The meal plan is now saved in the database, fetch it
        console.log('📥 Fetching saved meal plan...');
        
        const token = localStorage.getItem('authToken');
        const mealPlanResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/plans/current`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!mealPlanResponse.ok) {
          throw new Error('Failed to fetch meal plan');
        }

        const fetchedMealPlan = await mealPlanResponse.json();
        console.log('✅ Meal plan fetched:', fetchedMealPlan);
        
        setMealPlan(fetchedMealPlan);

        // Mark all steps as complete
        setCompletedSteps(loadingSteps.map((_, i) => i));
        setProgress(100);

        // Wait a moment to show completion, then navigate
        setTimeout(() => {
          console.log('➡️ Navigating to meal plan view');
          setCurrentStep(23);
          navigate('/onboarding/meal-plan-view'); // Or wherever you want to show the meal plan
        }, 1500);

      } catch (err) {
        console.error('❌ Failed to generate meal plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate meal plan');
      }
    };

    generatePlan();
  }, []);

  // Simulate progress while waiting for API
  useEffect(() => {
    if (error || mealPlan) return;

    const totalDuration = loadingSteps[loadingSteps.length - 1].duration;
    const updateInterval = 100; // Update every 100ms

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (totalDuration / updateInterval));
        return Math.min(newProgress, 95); // Cap at 95% until actual completion
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [error, mealPlan]);

  // Update current step based on progress
  useEffect(() => {
    if (error || mealPlan) return;

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
  }, [progress, error, mealPlan]);

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