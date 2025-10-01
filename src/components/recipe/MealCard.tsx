import { Clock } from 'lucide-react';
import { Meal } from '@/contexts/RecipeContext';

interface MealCardProps {
  meal: Meal;
  onClick?: () => void;
}

export const MealCard = ({ meal, onClick }: MealCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-card rounded-xl p-3 shadow-sm border border-border hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-left w-full group"
    >
      <div className="flex gap-3">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-20 h-20 rounded-lg object-cover bg-muted"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {meal.name}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{meal.prepTime} min</span>
          </div>
          <div className="flex gap-2 mt-2 text-xs">
            <span className="text-foreground font-medium">{meal.calories} cal</span>
            <span className="text-muted-foreground">P: {meal.protein}g</span>
          </div>
        </div>
      </div>
    </button>
  );
};
