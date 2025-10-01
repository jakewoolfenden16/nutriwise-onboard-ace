import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MealPlan } from '@/contexts/RecipeContext';
import { MealCard } from './MealCard';

interface DayCardProps {
  plan: MealPlan;
  isToday?: boolean;
}

export const DayCard = ({ plan, isToday }: DayCardProps) => {
  const [expanded, setExpanded] = useState(isToday);

  const allMeals = [
    ...plan.meals.breakfast,
    ...plan.meals.lunch,
    ...plan.meals.dinner,
    ...plan.meals.snacks
  ];

  return (
    <div className={`bg-card rounded-2xl p-5 shadow-md border-2 transition-all duration-300 ${
      isToday ? 'border-primary' : 'border-border'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground font-['Montserrat']">
              Day {plan.day} - {plan.dayName}
            </h3>
            <p className="text-sm text-muted-foreground">{plan.date}</p>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Calories</p>
            <p className="text-sm font-bold text-foreground">{plan.calories}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="text-sm font-bold text-foreground">{plan.macros.protein}g</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="text-sm font-bold text-foreground">{plan.macros.carbs}g</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="text-sm font-bold text-foreground">{plan.macros.fat}g</p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="space-y-3 mt-4 animate-fade-in">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Breakfast</h4>
            <div className="space-y-2">
              {plan.meals.breakfast.map(meal => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Lunch</h4>
            <div className="space-y-2">
              {plan.meals.lunch.map(meal => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Dinner</h4>
            <div className="space-y-2">
              {plan.meals.dinner.map(meal => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Snacks</h4>
            <div className="space-y-2">
              {plan.meals.snacks.map(meal => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
