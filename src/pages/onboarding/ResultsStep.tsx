import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Confetti } from '@/components/onboarding/Confetti';
import { Award, Zap, Target, Sparkles } from 'lucide-react';
import { calculateTargets } from '@/lib/api';
import type { QuestionnaireData, CalculationResponse } from '@/lib/types';

// Helper function to generate dynamic headline
const generateHeadline = (data: any, difference: number) => {
  const { overallGoal, weeklyWeightLoss, weightUnit = 'kg' } = data;
  
  if (overallGoal === 'lose' && weeklyWeightLoss && difference > 0) {
    const weeks = Math.round(difference / weeklyWeightLoss);
    return `Because you want to lose ${difference.toFixed(1)}${weightUnit} in ${weeks} weeks, here's the nutrition profile that will get you there.`;
  }
  
  if (overallGoal === 'build') {
    return "Ready to build muscle? Here's your personalised nutrition plan.";
  }
  
  if (overallGoal === 'maintain') {
    return "Perfect! Here's your plan for lean gains and maintaining your current weight.";
  }
  
  return "Here's your personalised nutrition plan, designed just for you.";
};

// Helper function to generate contextual tips
const generateContextualTips = (data: any) => {
  const tips: string[] = [];
  
  if (data.overallGoal === 'build') {
    tips.push('Focus on hitting your protein target daily to build lean muscle.');
  }
  
  if (data.fasting) {
    tips.push("We've distributed your calories across fewer meals for optimal balance.");
  }
  
  if (data.workoutFrequency && data.workoutFrequency >= 4) {
    tips.push('Your higher training volume means extra carbs for recovery.');
  }
  
  if (data.specificDiet && data.specificDiet !== 'none') {
    tips.push(`We've tailored your plan around your ${data.specificDiet} preferences.`);
  }
  
  if (data.cuisinePreferences && data.cuisinePreferences.length > 0) {
    tips.push(`Your meal suggestions will focus on ${data.cuisinePreferences[0]} flavors you love.`);
  }
  
  if (data.motivation && data.motivation.toLowerCase().includes('energy')) {
    tips.push('These macros will help boost your daily energy levels.');
  }
  
  // Default tips if not enough contextual ones
  if (tips.length < 2) {
    tips.push('Track your progress weekly to see meaningful trends.');
    tips.push('Stay hydrated with 8 glasses of water daily.');
  }
  
  return tips.slice(0, 3);
};

// Map frontend goal values to backend expected values
const mapGoalToBackend = (goal: string): string => {
  const goalMap: Record<string, string> = {
    'lose': 'Fat Loss',
    'build': 'Build Muscle',
    'maintain': 'General Health / Maintenance',
  };
  
  const mappedGoal = goalMap[goal.toLowerCase()] || 'General Health / Maintenance';
  console.log(`🎯 Mapping goal: "${goal}" → "${mappedGoal}"`);
  return mappedGoal;
};

export default function ResultsStep() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedCalories, setAnimatedCalories] = useState(0);
  const [animatedProtein, setAnimatedProtein] = useState(0);
  const [animatedCarbs, setAnimatedCarbs] = useState(0);
  const [animatedFat, setAnimatedFat] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculationData, setCalculationData] = useState<CalculationResponse['data'] | null>(null);

  const { data, setCurrentStep, setCalculatedTargets } = useOnboarding();
  const navigate = useNavigate();

  console.log('🔍 ResultsStep - Component mounted with data:', data);
  console.log('🔍 ResultsStep - Data validation:', {
    hasGender: !!data.gender,
    hasHeight: !!data.height,
    hasWeight: !!data.weight,
    hasAge: !!data.age,
    hasWorkoutFreq: !!data.workoutFrequency,
    hasGoal: !!data.overallGoal,
    hasWeightGoal: !!data.weightGoal,
    allDataKeys: Object.keys(data),
    dataValues: data
  });

  const goalWeight = data.weightGoal || 65;
  const currentWeight = data.weight || 70;
  const difference = Math.abs(currentWeight - goalWeight);

  const headline = generateHeadline(data, difference);
  const contextualTips = generateContextualTips(data);

  // Fetch calculation targets when component mounts
  useEffect(() => {
    const fetchTargets = async () => {
      console.log('🚀 useEffect - Calculating targets on component mount');
      
      // Check if we have the required data
      const hasRequiredData = data.gender && data.height && data.weight && data.age;
      if (!hasRequiredData) {
        console.warn('⚠️ Missing required onboarding data:', {
          hasGender: !!data.gender,
          hasHeight: !!data.height,
          hasWeight: !!data.weight,
          hasAge: !!data.age
        });
        setError('Please complete all previous onboarding steps first.');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);

        const weeklyRate = data.weeklyWeightLoss || 0.5;

        // Map the goal to backend expected format
        const mappedGoal = mapGoalToBackend(data.overallGoal || 'maintain');

        console.log('📊 Preparing request data:', {
          gender: data.gender,
          height: data.height,
          age: data.age,
          weight: data.weight,
          workouts_per_week: data.workoutFrequency,
          goal: mappedGoal,
          diet: data.specificDiet,
          weight_goal: data.weightGoal,
          planned_weekly_weight_loss: weeklyRate
        });

        const requestData: QuestionnaireData = {
          gender: (data.gender || 'male') as 'male' | 'female',
          height: data.height || 0,
          age: data.age || 0,
          weight: data.weight || 0,
          workouts_per_week: data.workoutFrequency || 0,
          goal: mappedGoal,
          diet: data.specificDiet || 'none',
          additional_considerations: [
            ...(data.foodsToAvoid || []),
            data.otherNotes || '',
          ].filter(Boolean).join(', '),
          weight_goal: data.weightGoal || 0,
          planned_weekly_weight_loss: weeklyRate,
        };

        console.log('📤 Sending calculate targets request:', requestData);

        // Call the PUBLIC API endpoint
        const response = await calculateTargets(requestData);
        
        console.log('✅ Calculate targets API response:', response);
        console.log('📦 Response structure:', {
          success: response?.success,
          hasData: response?.data !== undefined,
          hasNutritionalTargets: response?.data?.nutritional_targets !== undefined,
          calories: response?.data?.nutritional_targets?.calories,
          protein: response?.data?.nutritional_targets?.protein_grams,
          allKeys: response ? Object.keys(response) : []
        });

        if (!response || !response.success || !response.data) {
          throw new Error('Invalid response received from API');
        }

        // Store the response
        setCalculationData(response.data);
        
        // Save to context if available
        if (setCalculatedTargets) {
          console.log('💾 Saving calculated targets to context');
          setCalculatedTargets(response);
        }

        console.log('✅ Targets calculated successfully');
      } catch (err) {
        console.error('❌ Error calculating targets:', err);
        console.error('❌ Error details:', {
          type: err instanceof Error ? 'Error object' : typeof err,
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : 'No stack trace'
        });
        
        setError(err instanceof Error ? err.message : 'Failed to calculate targets');
      } finally {
        setIsLoading(false);
        console.log('🏁 Calculate targets fetch complete');
      }
    };

    fetchTargets();
  }, []);

  // Animation effect - trigger after data is loaded
  useEffect(() => {
    if (!calculationData || isLoading) return;

    console.log('✨ Starting animations with real data');
    setShowConfetti(true);
    
    setTimeout(() => setShowCards(true), 300);
    
    // Use REAL values from API response - handle nested structure
    const nutritionalTargets = calculationData.nutritional_targets || calculationData;
    const targetCalories = nutritionalTargets.calories || 2100;
    const targetProtein = nutritionalTargets.protein_grams || nutritionalTargets.protein || 150;
    const targetCarbs = nutritionalTargets.carbs_grams || nutritionalTargets.carbs || 200;
    const targetFat = nutritionalTargets.fat_grams || nutritionalTargets.fat || 70;

    console.log('🎯 Animation targets:', { targetCalories, targetProtein, targetCarbs, targetFat });
    
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedCalories(Math.round(targetCalories * progress));
      setAnimatedProtein(Math.round(targetProtein * progress));
      setAnimatedCarbs(Math.round(targetCarbs * progress));
      setAnimatedFat(Math.round(targetFat * progress));
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, [calculationData, isLoading]);

  const handleNext = () => {
    console.log('➡️ Navigating to diet step');
    console.log('💾 Calculated targets stored:', calculationData);
    setCurrentStep(17);
    navigate('/onboarding/diet');
  };

  // Show loading state
  if (isLoading) {
    return (
      <OnboardingLayout
        title="Calculating your personalized plan..."
        subtitle="This will only take a moment (when we say a moment, we might mean 2 minutes, but it will be worth the wait!)"
        hideProgress
      >
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />
            <div className="relative bg-gradient-to-br from-primary to-accent rounded-full p-6">
              <Sparkles className="h-12 w-12 text-white animate-spin" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Analyzing your profile...</p>
        </div>
      </OnboardingLayout>
    );
  }

  // Show error state
  if (error) {
    const isMissingData = error.includes('complete all previous');
    
    return (
      <OnboardingLayout
        title="Oops! Something went wrong"
        subtitle={isMissingData ? "We need a bit more information" : "We couldn't calculate your nutrition targets"}
        hideProgress
      >
        <div className="space-y-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-sm text-destructive mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              {isMissingData ? (
                <button
                  onClick={() => navigate('/onboarding/gender')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Start Onboarding
                </button>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <OnboardingLayout
        title={headline}
        subtitle="Your personalised nutrition profile is ready!"
        hideProgress
      >
        <div className="space-y-6">
          {/* Celebration Badge */}
          <div className="flex justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />
              <div className="relative bg-gradient-to-br from-primary to-accent rounded-full p-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Main Stats Card with Count-up Animation */}
          <div 
            className={`bg-gradient-to-br from-primary to-accent rounded-2xl p-6 shadow-lg text-primary-foreground transition-all duration-500 ${
              showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Daily Targets</h3>
              <Award className="h-6 w-6" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur hover:bg-white/20 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <p className="text-3xl font-bold relative z-10">{animatedCalories}</p>
                <p className="text-sm opacity-90 relative z-10">Calories</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur hover:bg-white/20 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <p className="text-3xl font-bold relative z-10">{animatedProtein}g</p>
                <p className="text-sm opacity-90 relative z-10">Protein</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur hover:bg-white/20 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <p className="text-3xl font-bold relative z-10">{animatedCarbs}g</p>
                <p className="text-sm opacity-90 relative z-10">Carbs</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur hover:bg-white/20 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <p className="text-3xl font-bold relative z-10">{animatedFat}g</p>
                <p className="text-sm opacity-90 relative z-10">Fat</p>
              </div>
            </div>
          </div>

          {/* Contextual Personalised Tips */}
          <div 
            className={`bg-card rounded-2xl p-6 shadow-md border border-border space-y-3 transition-all duration-500 delay-150 ${
              showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Why This Works For You</h3>
            </div>
            {contextualTips.map((tip, i) => (
              <div 
                key={i} 
                className="flex items-start gap-2 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Zap className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{tip}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>✨ All recommendations based on your unique profile and latest nutritional research</p>
          </div>
        </div>

        <NavigationButtons
          onNext={handleNext}
          nextLabel="See your meal plan"
          hideBack
        />
      </OnboardingLayout>
    </>
  );
}