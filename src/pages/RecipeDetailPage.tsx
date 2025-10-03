import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '@/contexts/RecipeContext';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function RecipeDetailPage() {
  const { mealId, dayNumber } = useParams<{ mealId: string; dayNumber: string }>();
  const navigate = useNavigate();
  const { mealPlans } = useRecipe();

  // Find the meal across all days
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
      <div className="sticky top-0 z-20 bg-card border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Back"
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground font-['Montserrat'] flex-1">
              {meal.name}
            </h1>
          </div>
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
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">
                <span className="font-semibold">Prep:</span> {meal.prepTime} mins
              </span>
            </div>
            {meal.cookTime !== undefined && meal.cookTime > 0 && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-foreground">
                  <span className="font-semibold">Cook:</span> {meal.cookTime} mins
                </span>
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
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground flex-1">
                    <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span> {ingredient.item}
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
            <ol className="space-y-4">
              {meal.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-foreground flex-1 pt-0.5">
                    {instruction}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>
    </div>
  );
}
