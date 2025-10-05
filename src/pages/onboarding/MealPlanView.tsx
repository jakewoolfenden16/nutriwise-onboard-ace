import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { getCurrentMealPlan } from '@/lib/api';
import { ChefHat, Calendar, Target, ArrowRight, Utensils, Loader2 } from 'lucide-react';

interface MealData {
  servings: number;
  recipe_name: string;
  target_calories: number;
  total_nutrition: {
    fat: number;
    protein: number;
    calories: number;
    carbohydrates: number;
  };
}

interface MealPlanResponse {
  id: string;
  plan_data: {
    meal_plan: {
      Breakfast?: MealData;
      Lunch?: MealData;
      Dinner?: MealData;
      'Snack 1'?: MealData;
      'Snack 2'?: MealData;
      'Daily Totals': {
        total_fat: number;
        total_protein: number;
        total_calories: number;
        total_carbohydrates: number;
      };
    };
  };
  user_targets: {
    fat: number;
    carbs: number;
    protein: number;
    calories: number;
  };
}

export default function MealPlanView() {
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { calculatedTargets } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        console.log('Fetching meal plan...');
        const plan = await getCurrentMealPlan();
        setMealPlan(plan);
      } catch (err) {
        console.error('Failed to fetch meal plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to load meal plan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMealPlan();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center max-w-md">
          <p className="text-sm text-destructive mb-4">{error || 'Meal plan not found'}</p>
          <button
            onClick={() => navigate('/recipe-homepage')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Recipes
          </button>
        </div>
      </div>
    );
  }

  const { plan_data, user_targets } = mealPlan;
  const meals = plan_data.meal_plan;
  const dailyTotals = meals['Daily Totals'];

  const mealOrder = ['Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner'];
  const mealIcons: Record<string, string> = {
    'Breakfast': '🍳',
    'Lunch': '🥗',
    'Dinner': '🍽️',
    'Snack 1': '🍎',
    'Snack 2': '🥜',
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <OnboardingLayout
        title="Your Personalized Meal Plan is Ready!"
        subtitle="Here's your day of perfectly balanced meals"
        hideProgress
      >
        <div className="space-y-6">
          {/* Success Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />
              <div className="relative bg-gradient-to-br from-primary to-accent rounded-full p-6">
                <ChefHat className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Daily Targets Summary */}
          <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 shadow-lg text-primary-foreground">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Today's Nutrition</h3>
              <Target className="h-6 w-6" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <p className="text-2xl font-bold">{Math.round(dailyTotals.total_calories)}</p>
                <p className="text-sm opacity-90">Calories</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <p className="text-2xl font-bold">{Math.round(dailyTotals.total_protein)}g</p>
                <p className="text-sm opacity-90">Protein</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <p className="text-2xl font-bold">{Math.round(dailyTotals.total_carbohydrates)}g</p>
                <p className="text-sm opacity-90">Carbs</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <p className="text-2xl font-bold">{Math.round(dailyTotals.total_fat)}g</p>
                <p className="text-sm opacity-90">Fat</p>
              </div>
            </div>
          </div>

          {/* Meals List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Your Meals Today
            </h3>
            
            {mealOrder.map((mealType) => {
              const meal = meals[mealType as keyof typeof meals] as MealData | undefined;
              if (!meal) return null;

              return (
                <div
                  key={mealType}
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{mealIcons[mealType]}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{mealType}</h4>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(meal.total_nutrition.calories)} cal
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{meal.recipe_name}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>P: {Math.round(meal.total_nutrition.protein)}g</span>
                        <span>C: {Math.round(meal.total_nutrition.carbohydrates)}g</span>
                        <span>F: {Math.round(meal.total_nutrition.fat)}g</span>
                        <span className="ml-auto">Servings: {meal.servings.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Target vs Actual Comparison */}
          <div className="bg-secondary/50 rounded-xl p-4 border border-border">
            <h4 className="font-medium text-foreground mb-3 text-sm">Target vs Actual</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calories</span>
                <span className="text-foreground">
                  {Math.round(dailyTotals.total_calories)} / {user_targets.calories}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protein</span>
                <span className="text-foreground">
                  {Math.round(dailyTotals.total_protein)}g / {user_targets.protein}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carbs</span>
                <span className="text-foreground">
                  {Math.round(dailyTotals.total_carbohydrates)}g / {user_targets.carbs}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fat</span>
                <span className="text-foreground">
                  {Math.round(dailyTotals.total_fat)}g / {user_targets.fat}g
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/onboarding/payment')}
            className="w-full bg-primary text-primary-foreground rounded-xl py-4 font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            View Full 7-Day Plan
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </OnboardingLayout>
    </div>
  );
}