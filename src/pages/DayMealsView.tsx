import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '@/contexts/RecipeContext';
import { DailySummary } from '@/components/recipe/DailySummary';
import { MealTimeline } from '@/components/recipe/MealTimeline';
import { getDailyPlanMeals } from '@/lib/api';
import type { DailyPlanMeals, MealDetail } from '@/lib/types';
import { Meal } from '@/contexts/RecipeContext';
import { Loader2 } from 'lucide-react';

export default function DayMealsView() {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const { eatenMeals, markMealAsEaten, unmarkMealAsEaten } = useRecipe();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyPlanData, setDailyPlanData] = useState<DailyPlanMeals | null>(null);

  const dailyPlanId = parseInt(dayNumber || '1', 10);

  // Fetch daily plan meals
  useEffect(() => {
    const fetchDailyMeals = async () => {
      try {
        setIsLoading(true);
        console.log(`📅 Fetching meals for daily plan ${dailyPlanId}...`);

        const data = await getDailyPlanMeals(dailyPlanId);
        console.log('✅ Daily meals fetched:', data);

        setDailyPlanData(data);
        setIsLoading(false);

      } catch (err) {
        console.error('❌ Failed to fetch daily meals:', err);
        setError(err instanceof Error ? err.message : 'Failed to load meals');
        setIsLoading(false);
      }
    };

    fetchDailyMeals();
  }, [dailyPlanId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading meals...</p>
        </div>
      </div>
    );
  }

  if (error || !dailyPlanData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center max-w-md">
          <p className="text-sm text-destructive mb-4">{error || 'Failed to load meals'}</p>
          <button
            onClick={() => navigate('/recipe-homepage')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Transform API meals to component format
  const transformMeal = (meal: MealDetail): Meal => ({
    id: meal.id.toString(),
    name: meal.recipes.name,
    image: '/placeholder.svg', // TODO: Add image field to recipes table
    calories: meal.actual_calories,
    protein: meal.actual_protein,
    carbs: meal.actual_carbs,
    fat: meal.actual_fat,
    prepTime: 15, // TODO: Add to recipes table
    mealType: meal.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
  });

  const groupedMeals = {
    breakfast: dailyPlanData.meals.filter(m => m.meal_type === 'breakfast').map(transformMeal),
    lunch: dailyPlanData.meals.filter(m => m.meal_type === 'lunch').map(transformMeal),
    dinner: dailyPlanData.meals.filter(m => m.meal_type === 'dinner').map(transformMeal),
    snacks: dailyPlanData.meals.filter(m => m.meal_type === 'snack').map(transformMeal),
  };

  const handleBack = () => navigate('/recipe-homepage');

  const handleMarkEaten = (mealId: string) => {
    if (eatenMeals.has(mealId)) {
      unmarkMealAsEaten(mealId);
    } else {
      markMealAsEaten(mealId);
    }
  };

  const handleViewRecipe = (mealId: string) => {
    navigate(`/recipe/${mealId}/${dailyPlanId}`);
  };

  const handleDayChange = (newDay: number) => {
    navigate(`/day/${newDay}`);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dailyPlanData.daily_plan.day_of_week - 1];
  const date = new Date(dailyPlanData.daily_plan.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  // TODO: Get all days from weekly plan context or API
  const allDays = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
    date: ''
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <DailySummary
        dayName={dayName}
        date={date}
        calories={dailyPlanData.daily_plan.total_calories}
        protein={dailyPlanData.daily_plan.total_protein}
        carbs={dailyPlanData.daily_plan.total_carbs}
        fat={dailyPlanData.daily_plan.total_fat}
        currentDay={dailyPlanData.daily_plan.day_of_week}
        allDays={allDays}
        onBack={handleBack}
        onDayChange={handleDayChange}
        onProfileClick={handleProfileClick}
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <MealTimeline
          meals={groupedMeals}
          onSwapMeal={(mealId) => console.log('Swap meal:', mealId)}
          onMarkEaten={handleMarkEaten}
          onViewRecipe={handleViewRecipe}
          eatenMeals={eatenMeals}
        />
      </div>
    </div>
  );
}
