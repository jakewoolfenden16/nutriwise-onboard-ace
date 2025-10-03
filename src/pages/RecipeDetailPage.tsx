import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '@/contexts/RecipeContext';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function RecipeDetailPage() {
  const { mealId, dayNumber } = useParams<{ mealId: string; dayNumber: string }>();
  const navigate = useNavigate();
  const { mealPlans } = useRecipe();

  // Find the meal across all days and meal types
  const meal = mealPlans
    .flatMap(plan => [
      ...plan.meals.breakfast,
      ...plan.meals.lunch,
      ...plan.meals.dinner,
      ...plan.meals.snacks
    ])
    .find(m => m.id === mealId);

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Recipe not found</p>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/day/${dayNumber}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground font-['Montserrat'] truncate">
            {meal.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Image */}
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-64 object-cover rounded-2xl shadow-md"
        />

        {/* Time Info */}
        <Card className="p-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Prep:</span>
              <span className="font-semibold text-foreground">{meal.prepTime} mins</span>
            </div>
            {meal.cookTime !== undefined && meal.cookTime > 0 && (
              <>
                <span className="text-muted-foreground">·</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Cook:</span>
                  <span className="font-semibold text-foreground">{meal.cookTime} mins</span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Ingredients */}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 font-['Montserrat']">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground">
                    <span className="font-semibold">{ingredient.quantity}</span>
                    {ingredient.unit && <span> {ingredient.unit}</span>}
                    <span> {ingredient.item}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Instructions */}
        {meal.instructions && meal.instructions.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 font-['Montserrat']">
              Instructions
            </h2>
            <ol className="space-y-3">
              {meal.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
                    {index + 1}
                  </span>
                  <span className="text-foreground pt-0.5">{instruction}</span>
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>
    </div>
  );
}
