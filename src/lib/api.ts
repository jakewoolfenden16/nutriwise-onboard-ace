import type {
  QuestionnaireData,
  CalculationResponse,
  SignupCredentials,
  LoginCredentials,
  AuthResponse,
  ProfileData,
  ProfileResponse,
  WeeklyPlanResponse,
  WeeklyPlanCurrent,
  WeeklyPlanDetail,
  DailyPlanMeals
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);

export const calculateTargets = async (data: QuestionnaireData): Promise<CalculationResponse> => {
  try {
    console.log('🌐 Making API request to:', `${API_BASE_URL}/public/calculate-targets`);
    console.log('📤 Request body:', JSON.stringify(data, null, 2));

    const response = await fetch(`${API_BASE_URL}/public/calculate-targets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      // Try to parse the error message from the backend
      let errorMessage = `Failed to calculate targets (${response.status})`;
      
      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);
        
        // Handle different error formats
        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          // FastAPI validation errors often come as { detail: [...] }
          if (Array.isArray(errorBody.detail)) {
            errorMessage = errorBody.detail
              .map((err: any) => `${err.loc?.join('.')}: ${err.msg}`)
              .join(', ');
          } else if (typeof errorBody.detail === 'string') {
            errorMessage = errorBody.detail;
          } else {
            errorMessage = JSON.stringify(errorBody.detail);
          }
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        } else {
          errorMessage = JSON.stringify(errorBody);
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
        const textError = await response.text();
        console.log('❌ Raw error text:', textError);
        errorMessage = textError || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Successful response:', result);
    return result;
  } catch (error) {
    console.error('❌ API call failed:', error);
    throw error;
  }
};

export const generateMealPlan = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No auth token found. Please log in.');
  }

  try {
    console.log('🌐 Making API request to:', `${API_BASE_URL}/plans/generate_meal_plan`);
    console.log('📋 Meal plan will be generated from user metadata');

    const response = await fetch(`${API_BASE_URL}/plans/generate_meal_plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // No body needed - backend fetches from metadata
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Failed to generate meal plan (${response.status})`;
      
      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);
        
        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          if (Array.isArray(errorBody.detail)) {
            errorMessage = errorBody.detail
              .map((err: any) => `${err.loc?.join('.')}: ${err.msg}`)
              .join(', ');
          } else if (typeof errorBody.detail === 'string') {
            errorMessage = errorBody.detail;
          } else {
            errorMessage = JSON.stringify(errorBody.detail);
          }
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        } else {
          errorMessage = JSON.stringify(errorBody);
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
        const textError = await response.text();
        console.log('❌ Raw error text:', textError);
        errorMessage = textError || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Meal plan generated successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ API call failed:', error);
    throw error;
  }
};

// Updated signup - now includes questionnaire_data
export const signup = async (credentials: SignupCredentials): Promise<{ message: string }> => {
  try {
    console.log('🌐 Making signup request to:', `${API_BASE_URL}/signup`);
    console.log('📤 Request includes:', { 
      email: credentials.email, 
      name: credentials.name,
      password: '***',
      has_questionnaire: !!credentials.questionnaire_data 
    });

    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Signup failed (${response.status})`;
      
      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);
        
        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          if (typeof errorBody.detail === 'string') {
            errorMessage = errorBody.detail;
          } else {
            errorMessage = JSON.stringify(errorBody.detail);
          }
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Signup successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Signup failed:', error);
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('🌐 Making login request to:', `${API_BASE_URL}/token`);
    
    // FastAPI's OAuth2PasswordRequestForm expects form data, not JSON
    const formData = new URLSearchParams();
    formData.append('username', credentials.email); // OAuth2 uses 'username' field
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Login failed (${response.status})`;
      
      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);
        
        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          if (typeof errorBody.detail === 'string') {
            errorMessage = errorBody.detail;
          } else {
            errorMessage = JSON.stringify(errorBody.detail);
          }
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Login successful');
    return result;
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

export const getCurrentMealPlan = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No auth token found. Please log in.');
  }

  try {
    console.log('🌐 Fetching current meal plan from:', `${API_BASE_URL}/plans/current`);

    const response = await fetch(`${API_BASE_URL}/plans/current`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Failed to fetch meal plan (${response.status})`;

      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);

        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          errorMessage = typeof errorBody.detail === 'string'
            ? errorBody.detail
            : JSON.stringify(errorBody.detail);
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Meal plan fetched successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch meal plan:', error);
    throw error;
  }
};

// POST /profile - Create or update user profile
export const createProfile = async (profileData: ProfileData): Promise<ProfileResponse> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No auth token found. Please log in.');
  }

  try {
    console.log('🌐 Creating/updating profile:', `${API_BASE_URL}/profile`);
    console.log('📤 Profile data:', profileData);

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Failed to create profile (${response.status})`;

      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);

        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          errorMessage = typeof errorBody.detail === 'string'
            ? errorBody.detail
            : JSON.stringify(errorBody.detail);
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Profile created/updated successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to create profile:', error);
    throw error;
  }
};

// POST /plans/generate_weekly_plan - Generate 7-day meal plan
export const generateWeeklyPlan = async (): Promise<WeeklyPlanResponse> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No auth token found. Please log in.');
  }

  try {
    console.log('🌐 Generating weekly meal plan:', `${API_BASE_URL}/plans/generate_weekly_plan`);

    const response = await fetch(`${API_BASE_URL}/plans/generate_weekly_plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Failed to generate weekly plan (${response.status})`;

      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);

        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          errorMessage = typeof errorBody.detail === 'string'
            ? errorBody.detail
            : JSON.stringify(errorBody.detail);
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Weekly plan generated successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to generate weekly plan:', error);
    throw error;
  }
};

// GET /plans/weekly/current - Get current weekly plan overview
export const getWeeklyPlanCurrent = async (): Promise<WeeklyPlanCurrent> => {
  const token = localStorage.getItem('authToken');

  // DEV MODE: Skip auth check if TEST_MODE is enabled
  const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';

  if (!token && !isTestMode) {
    throw new Error('No auth token found. Please log in.');
  }

  try {
    console.log('🌐 Fetching current weekly plan:', `${API_BASE_URL}/plans/weekly/current`);

    const response = await fetch(`${API_BASE_URL}/plans/weekly/current`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Failed to fetch weekly plan (${response.status})`;

      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);

        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          errorMessage = typeof errorBody.detail === 'string'
            ? errorBody.detail
            : JSON.stringify(errorBody.detail);
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Current weekly plan fetched:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch weekly plan:', error);
    throw error;
  }
};

// GET /plans/weekly/{id} - Get full weekly plan with all days
export const getWeeklyPlan = async (weeklyPlanId: number): Promise<WeeklyPlanDetail> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No auth token found. Please log in.');
  }

  try {
    console.log('🌐 Fetching weekly plan details:', `${API_BASE_URL}/plans/weekly/${weeklyPlanId}`);

    const response = await fetch(`${API_BASE_URL}/plans/weekly/${weeklyPlanId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Failed to fetch weekly plan details (${response.status})`;

      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);

        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          errorMessage = typeof errorBody.detail === 'string'
            ? errorBody.detail
            : JSON.stringify(errorBody.detail);
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Weekly plan details fetched:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch weekly plan details:', error);
    throw error;
  }
};

// GET /plans/daily/{id}/meals - Get all meals for a specific day
export const getDailyPlanMeals = async (dailyPlanId: number): Promise<DailyPlanMeals> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No auth token found. Please log in.');
  }

  try {
    console.log('🌐 Fetching daily plan meals:', `${API_BASE_URL}/plans/daily/${dailyPlanId}/meals`);

    const response = await fetch(`${API_BASE_URL}/plans/daily/${dailyPlanId}/meals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `Failed to fetch daily meals (${response.status})`;

      try {
        const errorBody = await response.json();
        console.log('❌ Error response body:', errorBody);

        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.detail) {
          errorMessage = typeof errorBody.detail === 'string'
            ? errorBody.detail
            : JSON.stringify(errorBody.detail);
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (parseError) {
        console.error('❌ Could not parse error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Daily meals fetched:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch daily meals:', error);
    throw error;
  }
};