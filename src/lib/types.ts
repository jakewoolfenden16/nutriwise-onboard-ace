
// Request type matching your backend MealPlanRequest model
export interface QuestionnaireData {
  gender: 'male' | 'female';
  height: number; // in cm
  age: number;
  weight: number; // in kg
  workouts_per_week: number; // 0-7
  goal: string; // "Fat Loss", "Lean Gains", "General Health / Maintenance", "Build Muscle"
  diet: string; // e.g., "vegetarian", "keto", "mediterranean", etc.
  additional_considerations?: string;
  weight_goal: number; // desired weight in kg
  planned_weekly_weight_loss: number; // kg per week (e.g., 0.5)
}

// Response type from calculate-targets endpoint
export interface CalculationResponse {
  success: boolean;
  data: {
    nutritional_targets: {
      calories: number;
      protein_grams: number;
      carbs_grams: number;
      fat_grams: number;
    };
    user_metrics: {
      tdee: number;
      activity_level: string;
      goal: string;
      diet: string;
    };
    weight_goal_info: {
      current_weight: number;
      goal_weight: number;
      total_weight_change_kg: number;
      planned_weekly_change_kg: number;
    };
  };
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  questionnaire_data?: {
    gender: string;
    workoutFrequency: number;
    height: number;
    weight: number;
    heightUnit: string;
    weightUnit: string;
    age: number;
    overallGoal: string;
    weightGoal: number;
    weeklyWeightLoss: number;
    specificDiet: string;
    cuisinePreferences: string[];
    otherNotes: string;
    foodsToAvoid: string[];
    motivation: string;
    motivationOther: string;
    mealPreferences: string[];
    fasting: boolean;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Profile types matching backend
export interface ProfileData {
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  age: number;
  workouts_per_week: number; // 0-7
  goal: 'lose' | 'build' | 'maintain';
  weight_goal: number; // kg
  planned_weekly_weight_loss?: number; // default 0.5
}

export interface ProfileResponse {
  status: string;
  message: string;
  profile: {
    id: string;
    gender: string;
    height: number;
    weight: number;
    age: number;
    workouts_per_week: number;
    goal: string;
    weight_goal: number;
    planned_weekly_weight_loss: number;
    updated_at: string;
  };
}

// Weekly plan types
export interface WeeklyPlanResponse {
  status: string;
  weekly_plan_id: number;
  week_start_date: string;
  days_generated: number;
  weekly_targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  message: string;
}

export interface WeeklyPlanCurrent {
  weekly_plan_id: number;
  week_start_date: string;
  status: string;
  created_at: string;
}

export interface DailyPlanMeal {
  id: number;
  meal_type: string;
  recipe_id: number;
}

export interface DailyPlanOverview {
  id: number;
  date: string;
  day_of_week: number;
  daily_target_calories: number;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meal_count: number;
  meals_preview: DailyPlanMeal[];
}

export interface WeeklyPlanDetail {
  weekly_plan: {
    id: number;
    user_id: string;
    week_start_date: string;
    status: string;
    weekly_target_calories: number;
    weekly_target_protein: number;
    weekly_target_carbs: number;
    weekly_target_fat: number;
    created_at: string;
    planned_weekly_weight_change_min?: number;
    planned_weekly_weight_change_max?: number;
    planned_weekly_weight_change_unit?: 'kg' | 'lbs';
  };
  daily_plans: DailyPlanOverview[];
  total_days: number;
}

export interface MealDetail {
  id: number;
  meal_type: string;
  servings: number;
  actual_calories: number;
  actual_protein: number;
  actual_carbs: number;
  actual_fat: number;
  meal_order: number;
  recipes: {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    dietary_tags: string[];
  };
}

export interface DailyPlanMeals {
  daily_plan: {
    id: number;
    date: string;
    day_of_week: number;
    daily_target_calories: number;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
  };
  meals: MealDetail[];
  meal_count: number;
}
