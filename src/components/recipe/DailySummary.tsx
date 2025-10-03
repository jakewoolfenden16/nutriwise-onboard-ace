import { ArrowLeft, Flame, Drumstick, Wheat, Droplet, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DailySummaryProps {
  dayName: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  currentDay: number;
  allDays: Array<{ day: number; dayName: string; date: string }>;
  onBack: () => void;
  onDayChange: (day: number) => void;
  onProfileClick: () => void;
}

export const DailySummary = ({
  dayName,
  date,
  calories,
  protein,
  carbs,
  fat,
  currentDay,
  allDays,
  onBack,
  onDayChange,
  onProfileClick
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
          
          <Select value={currentDay.toString()} onValueChange={(value) => onDayChange(parseInt(value))}>
            <SelectTrigger className="w-auto border-none bg-transparent hover:bg-accent focus:ring-0 focus:ring-offset-0">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground font-['Montserrat']">
                  {dayName}
                </div>
                <div className="text-sm text-muted-foreground">{date}</div>
              </div>
            </SelectTrigger>
            <SelectContent className="z-50">
              {allDays.map((day) => (
                <SelectItem key={day.day} value={day.day.toString()}>
                  <div className="text-center py-1">
                    <div className="font-bold">{day.dayName}</div>
                    <div className="text-sm text-muted-foreground">{day.date}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={onProfileClick}
            aria-label="Profile"
            className="rounded-full"
          >
            <User className="w-5 h-5" />
          </Button>
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
