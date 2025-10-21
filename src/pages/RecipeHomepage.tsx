import { useState, useEffect } from 'react';
import { Confetti } from '@/components/onboarding/Confetti';
import { DayCard } from '@/components/recipe/DayCard';
import { TipCard } from '@/components/recipe/TipCard';
import { BottomNavigation } from '@/components/recipe/BottomNavigation';
import { WeeklyTargetsCard } from '@/components/recipe/WeeklyTargetsCard';
import { EstimatedWeightCard } from '@/components/recipe/EstimatedWeightCard';
import { getWeeklyPlanCurrent, getWeeklyPlan } from '@/lib/api';
import type { WeeklyPlanDetail, DailyPlanOverview } from '@/lib/types';
import { MealPlan } from '@/contexts/RecipeContext';
import { Loader2 } from 'lucide-react';

export default function RecipeHomepage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weeklyPlanData, setWeeklyPlanData] = useState<WeeklyPlanDetail | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  // Fetch weekly plan data
  useEffect(() => {
    const fetchWeeklyPlan = async () => {
      try {
        setIsLoading(true);
        console.log('📅 Fetching weekly plan...');

        // Get current weekly plan ID
        const currentPlan = await getWeeklyPlanCurrent();
        console.log('✅ Current plan:', currentPlan);

        // Get full weekly plan details
        const weeklyPlan = await getWeeklyPlan(currentPlan.weekly_plan_id);
        console.log('✅ Weekly plan details:', weeklyPlan);

        setWeeklyPlanData(weeklyPlan);

        // Transform API data to MealPlan format for DayCard component
        const transformedPlans: MealPlan[] = weeklyPlan.daily_plans.map((day: DailyPlanOverview) => ({
          day: day.day_of_week,
          dailyPlanId: day.id, // Add daily plan ID for navigation
          date: new Date(day.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day.day_of_week - 1],
          calories: day.total_calories,
          macros: {
            protein: day.total_protein,
            carbs: day.total_carbs,
            fat: day.total_fat
          },
          meals: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
          }
        }));

        setMealPlans(transformedPlans);
        setIsLoading(false);

      } catch (err) {
        console.error('❌ Failed to fetch weekly plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to load meal plan');
        setIsLoading(false);
      }
    };

    fetchWeeklyPlan();
  }, []);

  useEffect(() => {
    const confettiTimer = setTimeout(() => setShowConfetti(false), 4000);
    const contentTimer = setTimeout(() => setShowContent(true), 300);
    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const personalizedTips = [
    "💧 Start your day with a glass of lemon water to boost metabolism",
    "🥗 Prep your meals on Sunday to stay consistent all week",
    "🏃‍♂️ A 10-minute walk after meals helps with digestion",
    "😴 Aim for 7-8 hours of sleep to support your fitness goals"
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your meal plan...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !weeklyPlanData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center max-w-md">
          <p className="text-sm text-destructive mb-4">{error || 'Failed to load meal plan'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const weeklyTargets = {
    calories: weeklyPlanData.weekly_plan.weekly_target_calories,
    protein: weeklyPlanData.weekly_plan.weekly_target_protein,
    carbs: weeklyPlanData.weekly_plan.weekly_target_carbs,
    fat: weeklyPlanData.weekly_plan.weekly_target_fat
  };

  const currentDay = 1; // TODO: Calculate based on current date vs week_start_date
  const userName = undefined; // TODO: Get from user profile

  // TODO: Get from profile data
  const estimatedWeightChange = {
    min: -0.5,
    max: -0.7,
    unit: 'kg' as const
  };

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="min-h-screen bg-background pb-24">
        {/* Personalized Header */}
        <div className={`pt-6 pb-4 px-4 transition-all duration-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            <h1 
              className="text-3xl md:text-4xl font-bold text-center text-foreground font-['Montserrat']"
              style={{ paddingTop: '24px', paddingBottom: '16px' }}
            >
              {userName ? `${userName}'s personalised nutrition plan` : 'Your personalised nutrition plan'}
            </h1>
          </div>
        </div>

        {/* Weekly Targets & Weight Estimate */}
        <div className={`px-4 mb-6 transition-all duration-700 delay-150 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="max-w-screen-xl mx-auto space-y-3">
            <div className="mb-4">
              <WeeklyTargetsCard targets={weeklyTargets} />
            </div>
            <EstimatedWeightCard weightChange={estimatedWeightChange} />
          </div>
        </div>

        {/* 7-Day Plan - Vertical Stack */}
        <div className={`mb-8 transition-all duration-700 delay-300 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="px-4 mb-4 max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground font-['Montserrat']">Your 7-Day Plan</h2>
          </div>
          
          <div className="px-4 space-y-3 max-w-screen-xl mx-auto">
            {mealPlans.map((plan) => (
              <DayCard key={plan.day} plan={plan} isToday={plan.day === currentDay} />
            ))}
          </div>
        </div>

        {/* Personalized Tips */}
        <div className={`px-4 mb-8 transition-all duration-700 delay-450 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-['Montserrat']">Personalized Tips</h2>
            <div className="space-y-3">
              {personalizedTips.map((tip, index) => (
                <TipCard key={index} tip={tip} delay={index * 100} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
