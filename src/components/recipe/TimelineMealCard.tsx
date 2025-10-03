import { Meal } from '@/contexts/RecipeContext';
import { RefreshCw, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineMealCardProps {
  meal: Meal;
  mealTime: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  isFirst: boolean;
  isLast: boolean;
  onSwap: (mealId: string) => void;
  onMarkEaten: (mealId: string) => void;
  isEaten: boolean;
}

const mealTypeColors = {
  breakfast: 'bg-amber-500',
  snack: 'bg-purple-500',
  lunch: 'bg-green-500',
  dinner: 'bg-orange-500'
};

export const TimelineMealCard = ({
  meal,
  mealTime,
  mealType,
  isFirst,
  isLast,
  onSwap,
  onMarkEaten,
  isEaten
}: TimelineMealCardProps) => {
  const dotColor = mealTypeColors[mealType];

  return (
    <div className="relative flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Line above */}
        {!isFirst && <div className="w-0.5 h-8 bg-border" />}
        
        {/* Dot */}
        <div className={`w-6 h-6 rounded-full border-4 border-background ${dotColor} z-10`} />
        
        {/* Line below */}
        {!isLast && <div className="w-0.5 flex-1 bg-border" />}
      </div>

      {/* Card */}
      <div className={`flex-1 mb-8 transition-opacity duration-300 ${isEaten ? 'opacity-75' : ''}`}>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
          {/* Meal Time Badge */}
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            {mealTime}
          </p>

          {/* Photo & Info */}
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-48 object-cover rounded-lg mb-3"
          />

          <h3 className="text-lg font-bold text-foreground mb-2 font-['Montserrat']">
            {meal.name}
          </h3>

          {/* Macros */}
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className="font-semibold text-foreground">{meal.calories} cal</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">P: {meal.protein}g</span>
            <span className="text-muted-foreground">C: {meal.carbs}g</span>
            <span className="text-muted-foreground">F: {meal.fat}g</span>
          </div>

          {/* Prep Time */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <Clock className="w-4 h-4" />
            <span>{meal.prepTime} min</span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwap(meal.id)}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Swap
            </Button>
            <Button
              variant={isEaten ? 'secondary' : 'default'}
              size="sm"
              onClick={() => onMarkEaten(meal.id)}
              className="gap-2"
            >
              <Check className={`w-4 h-4 ${isEaten ? 'text-green-500' : ''}`} />
              {isEaten ? 'Eaten ✓' : 'Mark Eaten'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
