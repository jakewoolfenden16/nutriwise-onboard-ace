import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MealPlan } from '@/contexts/RecipeContext';
import { MealCard } from './MealCard';

interface TodaysFocusProps {
  plan: MealPlan;
}

export const TodaysFocus = ({ plan }: TodaysFocusProps) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-5 shadow-lg border-2 border-primary/20 sticky top-4 z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-foreground font-['Montserrat']">Today's Plan</h2>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
          Day {plan.day}
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        One day at a time — you've got this 💪
      </p>

      <div className="space-y-2 mb-4">
        {plan.meals.breakfast.slice(0, 1).map(meal => (
          <MealCard key={meal.id} meal={meal} />
        ))}
        {plan.meals.lunch.slice(0, 1).map(meal => (
          <MealCard key={meal.id} meal={meal} />
        ))}
        {plan.meals.dinner.slice(0, 1).map(meal => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      <Button className="w-full h-12 text-base font-semibold">
        Cook this now
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};
