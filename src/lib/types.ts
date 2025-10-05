
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
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
