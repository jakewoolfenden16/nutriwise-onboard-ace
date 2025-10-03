import { Meal } from '@/contexts/RecipeContext';
import { TimelineMealCard } from './TimelineMealCard';

interface MealTimelineProps {
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
  onSwapMeal: (mealId: string) => void;
  onMarkEaten: (mealId: string) => void;
  onViewRecipe: (mealId: string) => void;
  eatenMeals: Set<string>;
}

type MealEntry = {
  meal: Meal;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

export const MealTimeline = ({
  meals,
  onSwapMeal,
  onMarkEaten,
  onViewRecipe,
  eatenMeals
}: MealTimelineProps) => {
  // Build ordered timeline: Breakfast → Snack 1 → Lunch → Snack 2 → Dinner → Snack 3
  const orderedMeals: MealEntry[] = [
    meals.breakfast[0] && { meal: meals.breakfast[0], time: 'Breakfast', type: 'breakfast' as const },
    meals.snacks[0] && { meal: meals.snacks[0], time: 'Snack 1', type: 'snack' as const },
    meals.lunch[0] && { meal: meals.lunch[0], time: 'Lunch', type: 'lunch' as const },
    meals.snacks[1] && { meal: meals.snacks[1], time: 'Snack 2', type: 'snack' as const },
    meals.dinner[0] && { meal: meals.dinner[0], time: 'Dinner', type: 'dinner' as const },
    meals.snacks[2] && { meal: meals.snacks[2], time: 'Snack 3', type: 'snack' as const },
  ].filter((item): item is MealEntry => item !== undefined);

  return (
    <div className="relative">
      {orderedMeals.map((entry, index) => (
        <TimelineMealCard
          key={entry.meal.id}
          meal={entry.meal}
          mealTime={entry.time}
          mealType={entry.type}
          isFirst={index === 0}
          isLast={index === orderedMeals.length - 1}
          onSwap={onSwapMeal}
          onMarkEaten={onMarkEaten}
          onViewRecipe={onViewRecipe}
          isEaten={eatenMeals.has(entry.meal.id)}
        />
      ))}
    </div>
  );
};
