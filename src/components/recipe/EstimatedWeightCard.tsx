import { Scale, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EstimatedWeightCardProps {
  weightChange: {
    min: number;
    max: number;
    unit: 'kg' | 'lbs';
  };
  showLbs?: boolean;
}

export const EstimatedWeightCard = ({ weightChange, showLbs = false }: EstimatedWeightCardProps) => {
  const { min, max, unit } = weightChange;
  
  // Determine color based on weight change direction
  const getColorClass = () => {
    if (min < 0 && max < 0) return 'text-primary'; // Weight loss - green
    if (min > 0 && max > 0) return 'text-blue-600'; // Weight gain - blue
    return 'text-muted-foreground'; // Maintenance
  };

  // Format weight range
  const formatWeight = (value: number, targetUnit: string) => {
    return Math.abs(value).toFixed(1);
  };

  const displayValue = `${min < 0 ? '-' : '+'}${formatWeight(min, unit)} ${unit} to ${min < 0 ? '-' : '+'}${formatWeight(max, unit)} ${unit}`;
  
  // Optional lbs conversion
  const lbsValue = showLbs && unit === 'kg' 
    ? `(${(min * 2.20462).toFixed(1)} lbs to ${(max * 2.20462).toFixed(1)} lbs)`
    : null;

  return (
    <div className="rounded-2xl shadow-sm bg-card p-6 border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Estimated Weight Change</h2>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" aria-hidden="true" />
                <span className="sr-only">Information about weight change estimate</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="max-w-xs">This estimate is based on your calorie deficit/surplus.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">This Week</p>
      
      <div className="text-center">
        <p className={`text-3xl font-bold ${getColorClass()}`}>
          {displayValue}
        </p>
        {lbsValue && (
          <p className="text-sm text-muted-foreground mt-2">{lbsValue}</p>
        )}
      </div>
    </div>
  );
};
