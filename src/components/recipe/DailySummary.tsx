import { ArrowLeft, Flame, Drumstick, Wheat, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailySummaryProps {
  dayName: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  onBack: () => void;
}

export const DailySummary = ({
  dayName,
  date,
  calories,
  protein,
  carbs,
  fat,
  onBack
}: DailySummaryProps) => {
  return (
    <div className="sticky top-0 z-20 bg-card border-b border-border rounded-b-2xl shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            aria-label="Back to weekly view"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-right">
            <h1 className="text-xl font-bold text-foreground font-['Montserrat']">
              {dayName}
            </h1>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col items-center gap-1">
            <Flame className="w-5 h-5 text-primary" />
            <p className="text-lg font-bold text-foreground">{calories}</p>
            <p className="text-xs text-muted-foreground">Calories</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Drumstick className="w-5 h-5 text-primary" />
            <p className="text-lg font-bold text-foreground">{protein}g</p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Wheat className="w-5 h-5 text-primary" />
            <p className="text-lg font-bold text-foreground">{carbs}g</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Droplet className="w-5 h-5 text-primary" />
            <p className="text-lg font-bold text-foreground">{fat}g</p>
            <p className="text-xs text-muted-foreground">Fat</p>
          </div>
        </div>
      </div>
    </div>
  );
};
