import React, { createContext, useContext, useState } from 'react';
import type { CalculationResponse } from '@/lib/types';

export interface OnboardingData {
  gender?: string;
  workoutFrequency?: number;
  height?: number;
  weight?: number;
  heightUnit?: 'cm' | 'ft';
  weightUnit?: 'kg' | 'lbs';
  age?: number;
  weightGoal?: number;
  overallGoal?: string;
  goalSpeed?: number; // Legacy, keeping for backwards compatibility
  weeklyWeightLoss?: number; // New: kg per week (0.1 - 1.5)
  specificDiet?: string;
  cuisinePreferences?: string[];
  otherNotes?: string;
  foodsToAvoid?: string[];
  motivation?: string;
  motivationOther?: string;
  mealPreferences?: string[];
  fasting?: boolean;
  email?: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  resetData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  calculatedTargets: CalculationResponse['data'] | null;
  setCalculatedTargets: (targets: CalculationResponse['data']) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedTargets, setCalculatedTargets] = useState<CalculationResponse['data'] | null>(null);

  const updateData = (newData: Partial<OnboardingData>) => {
    console.log('📝 OnboardingContext - Updating data:', newData);
    console.log('📝 OnboardingContext - Previous data:', data);
    setData((prev) => {
      const updated = { ...prev, ...newData };
      console.log('📝 OnboardingContext - New merged data:', updated);
      return updated;
    });
  };

  const resetData = () => {
    console.log('🔄 OnboardingContext - Resetting all data');
    setData({});
    setCurrentStep(1);
    setCalculatedTargets(null);
  };

  return (
    <OnboardingContext.Provider 
      value={{ 
        data, 
        updateData, 
        resetData, 
        currentStep, 
        setCurrentStep,
        calculatedTargets,
        setCalculatedTargets
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};