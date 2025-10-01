import { createContext, useContext, ReactNode } from 'react';

export interface Meal {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
}

export interface MealPlan {
  day: number;
  date: string;
  dayName: string;
  calories: number;
  macros: { protein: number; carbs: number; fat: number };
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
}

const mockMealPlans: MealPlan[] = Array.from({ length: 7 }, (_, i) => ({
  day: i + 1,
  date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
  calories: 2100,
  macros: { protein: 150, carbs: 210, fat: 78 },
  meals: {
    breakfast: [
      { id: `b${i}1`, name: 'Greek Yogurt Bowl', image: '/placeholder.svg', calories: 320, protein: 25, carbs: 35, fat: 8, prepTime: 5 },
      { id: `b${i}2`, name: 'Fresh Berries', image: '/placeholder.svg', calories: 80, protein: 1, carbs: 18, fat: 0, prepTime: 2 }
    ],
    lunch: [
      { id: `l${i}1`, name: 'Grilled Chicken Salad', image: '/placeholder.svg', calories: 450, protein: 45, carbs: 30, fat: 18, prepTime: 15 }
    ],
    dinner: [
      { id: `d${i}1`, name: 'Salmon with Quinoa', image: '/placeholder.svg', calories: 580, protein: 50, carbs: 55, fat: 22, prepTime: 25 }
    ],
    snacks: [
      { id: `s${i}1`, name: 'Protein Smoothie', image: '/placeholder.svg', calories: 220, protein: 20, carbs: 28, fat: 4, prepTime: 5 }
    ]
  }
}));

interface RecipeContextType {
  mealPlans: MealPlan[];
  currentDay: number;
  healthScore: number;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    mealPlans: mockMealPlans,
    currentDay: 1,
    healthScore: 95
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error('useRecipe must be used within RecipeProvider');
  return context;
};
