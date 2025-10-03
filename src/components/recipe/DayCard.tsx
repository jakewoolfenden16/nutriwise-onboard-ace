import { MealPlan } from '@/contexts/RecipeContext';
import { useNavigate } from 'react-router-dom';

interface DayCardProps {
  plan: MealPlan;
  isToday?: boolean;
}

const dayColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-indigo-500'
];

const mealTypeColors = {
  breakfast: 'bg-amber-400',
  lunch: 'bg-green-400',
  dinner: 'bg-orange-500',
  snack: 'bg-purple-400'
};

const mealTypeLabels = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack'
};

export const DayCard = ({ plan, isToday }: DayCardProps) => {
  const navigate = useNavigate();

  const allMeals = [
    ...plan.meals.breakfast,
    ...plan.meals.lunch,
    ...plan.meals.dinner,
    ...plan.meals.snacks
  ];

  const dayColorClass = dayColors[(plan.day - 1) % 7];

  return (
    <div 
      onClick={() => navigate(`/day/${plan.day}`)}
      className={`relative bg-card rounded-xl shadow-sm border transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-lg ${
        isToday ? 'border-primary' : 'border-border'
      }`}
    >
      {/* Left colored sidebar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${dayColorClass}`} />
      
      <div className="pl-5 pr-4 py-4">
        {/* Header with Day and Macros */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-foreground font-['Montserrat']">
                {plan.dayName} {plan.date}
              </h3>
            </div>
          </div>
          
          {/* Inline Macros */}
          <p className="text-sm text-muted-foreground font-medium">
            Calories {plan.calories} | Protein {plan.macros.protein}g | Fat {plan.macros.fat}g | Carbs {plan.macros.carbs}g
          </p>
        </div>

        {/* Flat Meal List */}
        <div className="space-y-2">
          {allMeals.map((meal) => {
            const colorClass = mealTypeColors[meal.mealType];
            const typeLabel = mealTypeLabels[meal.mealType];
            
            return (
              <div key={meal.id} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-sm ${colorClass} flex-shrink-0`} />
                <p className="text-sm text-foreground">
                  {meal.name} <span className="text-muted-foreground">({typeLabel})</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
