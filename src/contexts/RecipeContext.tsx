import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { getWeeklyPlanCurrent, getWeeklyPlan, generateWeeklyPlan } from '@/lib/api';
import type { DailyPlanOverview } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

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
  dailyPlanId?: number; // Optional for backward compatibility
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
        cookTime: 0,
        mealType: 'breakfast',
        ingredients: [
          { item: 'Greek yogurt', quantity: '200', unit: 'g' },
          { item: 'Mixed berries', quantity: '100', unit: 'g' },
          { item: 'Honey', quantity: '1', unit: 'tbsp' },
          { item: 'Granola', quantity: '30', unit: 'g' }
        ],
        instructions: [
          'Add Greek yogurt to a bowl',
          'Top with mixed berries',
          'Drizzle honey on top',
          'Sprinkle granola for crunch',
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
        prepTime: 10, 
        cookTime: 15,
        mealType: 'lunch',
        ingredients: [
          { item: 'Chicken breast', quantity: '200', unit: 'g' },
          { item: 'Mixed greens', quantity: '100', unit: 'g' },
          { item: 'Cherry tomatoes', quantity: '50', unit: 'g' },
          { item: 'Cucumber', quantity: '50', unit: 'g' },
          { item: 'Olive oil', quantity: '1', unit: 'tbsp' },
          { item: 'Lemon juice', quantity: '1', unit: 'tbsp' }
        ],
        instructions: [
          'Season chicken breast with salt and pepper',
          'Grill chicken for 6-7 minutes each side until cooked through',
          'Let chicken rest for 5 minutes, then slice',
          'Wash and prepare salad greens, tomatoes, and cucumber',
          'Arrange greens on plate, top with sliced chicken',
          'Drizzle with olive oil and lemon juice',
          'Season to taste and serve'
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
        cookTime: 25,
        mealType: 'dinner',
        ingredients: [
          { item: 'Salmon fillet', quantity: '200', unit: 'g' },
          { item: 'Quinoa', quantity: '80', unit: 'g' },
          { item: 'Broccoli', quantity: '150', unit: 'g' },
          { item: 'Lemon', quantity: '1', unit: 'piece' },
          { item: 'Olive oil', quantity: '1', unit: 'tbsp' },
          { item: 'Garlic', quantity: '2', unit: 'cloves' }
        ],
        instructions: [
          'Rinse quinoa and cook according to package instructions',
          'Preheat oven to 200°C (400°F)',
          'Season salmon with salt, pepper, and lemon juice',
          'Place salmon on baking sheet and bake for 12-15 minutes',
          'Steam broccoli for 5-7 minutes until tender',
          'Sauté garlic in olive oil until fragrant',
          'Serve salmon over quinoa with broccoli on the side',
          'Drizzle with garlic oil and garnish with lemon wedges'
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
        cookTime: 0,
        mealType: 'snack',
        ingredients: [
          { item: 'Banana', quantity: '1', unit: 'piece' },
          { item: 'Protein powder', quantity: '30', unit: 'g' },
          { item: 'Almond milk', quantity: '250', unit: 'ml' },
          { item: 'Spinach', quantity: '30', unit: 'g' },
          { item: 'Ice cubes', quantity: '4', unit: 'pieces' }
        ],
        instructions: [
          'Add all ingredients to a blender',
          'Blend on high speed for 30-60 seconds until smooth',
          'Pour into a glass',
          'Enjoy immediately for best taste and nutrition'
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
  refreshWeeklyPlan: (options?: { allowGenerate?: boolean }) => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [eatenMeals, setEatenMeals] = useState<Set<string>>(new Set());
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(mockMealPlans);
  const [, setIsLoading] = useState(true);
  const { token } = useAuth();
  const isMountedRef = useRef(true);
  const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refreshWeeklyPlan = useCallback(async (options?: { allowGenerate?: boolean }) => {
    const allowGenerate = options?.allowGenerate ?? false;
    const authToken = token ?? localStorage.getItem('authToken');
    const hasPendingQuestionnaire = Boolean(localStorage.getItem('pendingQuestionnaire'));

    if (hasPendingQuestionnaire) {
      console.log('⏳ RecipeContext: Pending onboarding data detected, skipping weekly plan fetch');
      if (isMountedRef.current) {
        setMealPlans(mockMealPlans);
        setIsLoading(false);
      }
      return;
    }

    if (!authToken && !isTestMode) {
      console.log('⏭️ RecipeContext: No auth token found, skipping weekly plan fetch');
      if (isMountedRef.current) {
        setMealPlans(mockMealPlans);
        setIsLoading(false);
      }
      return;
    }

    if (isMountedRef.current) {
      setIsLoading(true);
    }

    try {
      console.log('🔄 RecipeContext: Fetching weekly plan data...');

      let currentPlanId: number;

      try {
        const currentPlan = await getWeeklyPlanCurrent();
        currentPlanId = currentPlan.weekly_plan_id;
        console.log('✅ RecipeContext: Current weekly plan ID:', currentPlanId);
      } catch (rawError) {
        const error = rawError instanceof Error ? rawError : new Error(String(rawError));

        if (allowGenerate && error.message.includes('No active weekly plan')) {
          console.log('📝 RecipeContext: No weekly plan found, generating one (allowed)...');
          const newPlan = await generateWeeklyPlan();
          currentPlanId = newPlan.weekly_plan_id;
          console.log('✅ RecipeContext: Weekly plan generated with ID:', currentPlanId);
        } else {
          throw error;
        }
      }

      const weeklyPlan = await getWeeklyPlan(currentPlanId);
      console.log('✅ RecipeContext: Weekly plan fetched:', weeklyPlan);

      if (!isMountedRef.current) return;

      const transformedPlans: MealPlan[] = weeklyPlan.daily_plans.map((dailyPlan: DailyPlanOverview) => ({
        day: dailyPlan.day_of_week,
        dailyPlanId: dailyPlan.id,
        date: new Date(dailyPlan.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dailyPlan.day_of_week - 1],
        calories: dailyPlan.total_calories,
        macros: {
          protein: dailyPlan.total_protein,
          carbs: dailyPlan.total_carbs,
          fat: dailyPlan.total_fat
        },
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        }
      }));

      setMealPlans(transformedPlans);
    } catch (rawError) {
      const error = rawError instanceof Error ? rawError : new Error(String(rawError));
      console.error('❌ RecipeContext: Failed to fetch weekly plan:', error);
      console.log('⚠️ RecipeContext: Falling back to mock data');
      if (isMountedRef.current) {
        setMealPlans(mockMealPlans);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [token, isTestMode]);

  // Fetch real weekly plan data when auth state changes
  useEffect(() => {
    refreshWeeklyPlan();
  }, [refreshWeeklyPlan]);

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
    mealPlans,
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
    unmarkMealAsEaten,
    refreshWeeklyPlan
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error('useRecipe must be used within RecipeProvider');
  return context;
};
