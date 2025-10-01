import { Lightbulb } from 'lucide-react';

interface TipCardProps {
  tip: string;
  delay?: number;
}

export const TipCard = ({ tip, delay = 0 }: TipCardProps) => {
  return (
    <div
      className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
};
