import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '@/contexts/RecipeContext';
import { DailySummary } from '@/components/recipe/DailySummary';
import { MealTimeline } from '@/components/recipe/MealTimeline';

export default function DayMealsView() {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const { mealPlans, eatenMeals, markMealAsEaten, unmarkMealAsEaten } = useRecipe();

  const day = parseInt(dayNumber || '1', 10);
  const plan = mealPlans.find(p => p.day === day);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Day not found</p>
      </div>
    );
  }

  const handleBack = () => navigate('/recipe');

  const handleMarkEaten = (mealId: string) => {
    if (eatenMeals.has(mealId)) {
      unmarkMealAsEaten(mealId);
    } else {
      markMealAsEaten(mealId);
    }
  };

  const handleViewRecipe = (mealId: string) => {
    navigate(`/recipe/${mealId}/${day}`);
  };

  const handleDayChange = (newDay: number) => {
    navigate(`/day/${newDay}`);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const allDays = mealPlans.map(p => ({
    day: p.day,
    dayName: p.dayName,
    date: p.date
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <DailySummary
        dayName={plan.dayName}
        date={plan.date}
        calories={plan.calories}
        protein={plan.macros.protein}
        carbs={plan.macros.carbs}
        fat={plan.macros.fat}
        currentDay={day}
        allDays={allDays}
        onBack={handleBack}
        onDayChange={handleDayChange}
        onProfileClick={handleProfileClick}
      />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <MealTimeline
          meals={plan.meals}
          onSwapMeal={(mealId) => console.log('Swap meal:', mealId)}
          onMarkEaten={handleMarkEaten}
          onViewRecipe={handleViewRecipe}
          eatenMeals={eatenMeals}
        />
      </div>
    </div>
  );
}
