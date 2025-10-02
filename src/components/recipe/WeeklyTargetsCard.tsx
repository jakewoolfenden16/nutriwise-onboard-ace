import { Flame, Dumbbell, Wheat, Droplet } from 'lucide-react';

interface WeeklyTargetsCardProps {
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const WeeklyTargetsCard = ({ targets }: WeeklyTargetsCardProps) => {
  return (
    <div className="rounded-2xl shadow-sm bg-card p-6 border border-border">
      <h2 className="text-lg font-semibold mb-4">Your Weekly Targets</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Calories */}
        <div className="flex items-center gap-3">
          <Flame className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Calories</span>
            <span className="text-2xl font-bold text-primary">{targets.calories} kcal</span>
          </div>
        </div>

        {/* Protein */}
        <div className="flex items-center gap-3">
          <Dumbbell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Protein</span>
            <span className="text-2xl font-bold text-primary">{targets.protein}g</span>
          </div>
        </div>

        {/* Carbs */}
        <div className="flex items-center gap-3">
          <Wheat className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Carbs</span>
            <span className="text-2xl font-bold text-primary">{targets.carbs}g</span>
          </div>
        </div>

        {/* Fat */}
        <div className="flex items-center gap-3">
          <Droplet className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Fat</span>
            <span className="text-2xl font-bold text-primary">{targets.fat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};
