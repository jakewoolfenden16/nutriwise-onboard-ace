import React, { createContext, useContext, useState } from 'react';

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
  goalSpeed?: number;
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
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(1);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setData({});
    setCurrentStep(1);
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData, currentStep, setCurrentStep }}>
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
