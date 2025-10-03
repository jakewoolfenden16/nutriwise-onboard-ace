import { createContext, useContext, ReactNode, useState } from 'react';

export interface Meal {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cookTime?: number;
  ingredients?: Array<{ item: string; quantity: string; unit: string }>;
  instructions?: string[];
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
      { 
        id: `b${i}1`, 
        name: 'Greek Yogurt and Berries', 
        image: '/placeholder.svg', 
        calories: 400, 
        protein: 26, 
        carbs: 53, 
        fat: 8, 
        prepTime: 5, 
        mealType: 'breakfast',
        cookTime: 0,
        ingredients: [
          { item: 'Greek yogurt', quantity: '200', unit: 'g' },
          { item: 'Mixed berries', quantity: '100', unit: 'g' },
          { item: 'Honey', quantity: '1', unit: 'tbsp' },
          { item: 'Granola', quantity: '30', unit: 'g' }
        ],
        instructions: [
          'Add Greek yogurt to a bowl',
          'Top with fresh mixed berries',
          'Drizzle honey over the yogurt',
          'Sprinkle granola on top',
          'Serve immediately'
        ]
      }
    ],
    lunch: [
      { 
        id: `l${i}1`, 
        name: 'Grilled Chicken Salad', 
        image: '/placeholder.svg', 
        calories: 450, 
        protein: 45, 
        carbs: 30, 
        fat: 18, 
        prepTime: 15, 
        mealType: 'lunch',
        cookTime: 20,
        ingredients: [
          { item: 'Chicken breast', quantity: '200', unit: 'g' },
          { item: 'Mixed salad greens', quantity: '100', unit: 'g' },
          { item: 'Cherry tomatoes', quantity: '10', unit: 'pcs' },
          { item: 'Cucumber', quantity: '1/2', unit: 'pc' },
          { item: 'Olive oil', quantity: '1', unit: 'tbsp' },
          { item: 'Lemon juice', quantity: '1', unit: 'tbsp' }
        ],
        instructions: [
          'Season chicken breast with salt and pepper',
          'Heat grill pan over medium-high heat',
          'Grill chicken for 8-10 minutes per side until cooked through',
          'Let chicken rest for 5 minutes, then slice',
          'Wash and prepare salad greens, tomatoes, and cucumber',
          'Arrange salad on a plate',
          'Top with sliced grilled chicken',
          'Drizzle with olive oil and lemon juice'
        ]
      }
    ],
    dinner: [
      { 
        id: `d${i}1`, 
        name: 'Salmon with Quinoa', 
        image: '/placeholder.svg', 
        calories: 580, 
        protein: 50, 
        carbs: 55, 
        fat: 22, 
        prepTime: 10, 
        mealType: 'dinner',
        cookTime: 25,
        ingredients: [
          { item: 'Salmon fillet', quantity: '200', unit: 'g' },
          { item: 'Quinoa', quantity: '80', unit: 'g' },
          { item: 'Broccoli', quantity: '150', unit: 'g' },
          { item: 'Garlic', quantity: '2', unit: 'cloves' },
          { item: 'Olive oil', quantity: '1', unit: 'tbsp' },
          { item: 'Lemon', quantity: '1/2', unit: 'pc' }
        ],
        instructions: [
          'Rinse quinoa and cook according to package instructions',
          'Preheat oven to 200°C (400°F)',
          'Season salmon with salt, pepper, and minced garlic',
          'Place salmon on a baking sheet lined with parchment paper',
          'Drizzle with olive oil and add lemon slices on top',
          'Bake for 12-15 minutes until salmon is cooked through',
          'Steam broccoli for 5-7 minutes until tender',
          'Serve salmon over quinoa with steamed broccoli on the side'
        ]
      }
    ],
    snacks: [
      { 
        id: `s${i}1`, 
        name: 'Protein Smoothie', 
        image: '/placeholder.svg', 
        calories: 220, 
        protein: 20, 
        carbs: 28, 
        fat: 4, 
        prepTime: 5, 
        mealType: 'snack',
        cookTime: 0,
        ingredients: [
          { item: 'Protein powder', quantity: '30', unit: 'g' },
          { item: 'Banana', quantity: '1', unit: 'pc' },
          { item: 'Almond milk', quantity: '250', unit: 'ml' },
          { item: 'Spinach', quantity: '1', unit: 'handful' },
          { item: 'Ice cubes', quantity: '4-5', unit: 'pcs' }
        ],
        instructions: [
          'Add almond milk to blender',
          'Add protein powder, banana, and spinach',
          'Add ice cubes',
          'Blend on high speed for 30-60 seconds until smooth',
          'Pour into a glass and enjoy immediately'
        ]
      }
    ]
  }
}));

interface RecipeContextType {
  mealPlans: MealPlan[];
  currentDay: number;
  healthScore: number;
  userName?: string;
  weeklyTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  estimatedWeightChange: {
    min: number;
    max: number;
    unit: 'kg' | 'lbs';
  };
  eatenMeals: Set<string>;
  markMealAsEaten: (mealId: string) => void;
  unmarkMealAsEaten: (mealId: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [eatenMeals, setEatenMeals] = useState<Set<string>>(new Set());

  const markMealAsEaten = (mealId: string) => {
    setEatenMeals(prev => new Set([...prev, mealId]));
  };

  const unmarkMealAsEaten = (mealId: string) => {
    setEatenMeals(prev => {
      const newSet = new Set(prev);
      newSet.delete(mealId);
      return newSet;
    });
  };

  const value = {
    mealPlans: mockMealPlans,
    currentDay: 1,
    healthScore: 95,
    userName: undefined,
    weeklyTargets: {
      calories: 2100,
      protein: 150,
      carbs: 210,
      fat: 78
    },
    estimatedWeightChange: {
      min: -0.5,
      max: -0.7,
      unit: 'kg' as const
    },
    eatenMeals,
    markMealAsEaten,
    unmarkMealAsEaten
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error('useRecipe must be used within RecipeProvider');
  return context;
};
