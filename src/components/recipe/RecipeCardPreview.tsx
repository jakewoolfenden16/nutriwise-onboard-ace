import { Clock } from 'lucide-react';

interface RecipeCardPreviewProps {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: number;
  image: string;
}

export const RecipeCardPreview = ({
  title,
  calories,
  protein,
  carbs,
  fat,
  time,
  image,
}: RecipeCardPreviewProps) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <h4 className="font-semibold text-lg text-foreground">{title}</h4>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-medium">{calories} cal</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{time} min</span>
          </div>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="text-foreground">
            <span className="font-semibold">P:</span> {protein}g
          </span>
          <span className="text-foreground">
            <span className="font-semibold">C:</span> {carbs}g
          </span>
          <span className="text-foreground">
            <span className="font-semibold">F:</span> {fat}g
          </span>
        </div>
      </div>
    </div>
  );
};
