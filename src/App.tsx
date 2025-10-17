import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { RecipeProvider } from "@/contexts/RecipeContext";
import { AuthProvider } from "@/contexts/AuthContext"; // ADD THIS
import { DeveloperNav } from "@/components/onboarding/DeveloperNav";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RecipeHomepage from "./pages/RecipeHomepage";
import DayMealsView from "./pages/DayMealsView";
import RecipeDetailPage from "./pages/RecipeDetailPage";

// Onboarding pages
import GenderStep from "./pages/onboarding/GenderStep";
import WorkoutStep from "./pages/onboarding/WorkoutStep";
import MeasurementsStep from "./pages/onboarding/MeasurementsStep";
import AgeStep from "./pages/onboarding/AgeStep";
import WeightGoalStep from "./pages/onboarding/WeightGoalStep";
import InfoPersonalising from "./pages/onboarding/InfoPersonalising";
import InfoProgress from "./pages/onboarding/InfoProgress";
import GoalSpeedStep from "./pages/onboarding/GoalSpeedStep";
import DietStep from "./pages/onboarding/DietStep";
import CuisineStep from "./pages/onboarding/CuisineStep";
import AvoidStep from "./pages/onboarding/AvoidStep";
import MealPreferencesStep from "./pages/onboarding/MealPreferencesStep";
import LoadingStep from "./pages/onboarding/LoadingStep";
import ResultsStep from "./pages/onboarding/ResultsStep";
import AccountStep from "./pages/onboarding/AccountStep";
import PaymentStep from "./pages/onboarding/PaymentStep";
import MealPlanView from "./pages/onboarding/MealPlanView"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider> {/* ADD THIS WRAPPER */}
          <OnboardingProvider>
            <RecipeProvider>
              <DeveloperNav />
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Onboarding Flow */}
                <Route path="/onboarding/gender" element={<GenderStep />} />
                <Route path="/onboarding/workout" element={<WorkoutStep />} />
                {/* DELETED: Page 3 - InfoSustainable (marketing) */}
                <Route path="/onboarding/measurements" element={<MeasurementsStep />} />
                <Route path="/onboarding/age" element={<AgeStep />} />
                <Route path="/onboarding/weight-goal" element={<WeightGoalStep />} />
                {/* DELETED: Page 6 - OverallGoalStep (not needed) */}
                <Route path="/onboarding/info-personalising" element={<InfoPersonalising />} />
                <Route path="/onboarding/info-progress" element={<InfoProgress />} />
                <Route path="/onboarding/goal-speed" element={<GoalSpeedStep />} />
                {/* DELETED: Page 10 - InfoComparison (marketing) */}
                <Route path="/onboarding/diet" element={<DietStep />} />
                <Route path="/onboarding/cuisine" element={<CuisineStep />} />
                {/* COMMENTED OUT: Page 13 - AvoidStep (not connected to backend yet) */}
                {/* <Route path="/onboarding/avoid" element={<AvoidStep />} /> */}
                {/* DELETED: Page 14 - MotivationStep (not needed) */}
                {/* COMMENTED OUT: Page 15 - MealPreferencesStep (not connected to backend yet) */}
                {/* <Route path="/onboarding/meals" element={<MealPreferencesStep />} /> */}
                {/* DELETED: Page 16 - FastingStep (not needed) */}
                <Route path="/onboarding/account" element={<AccountStep />} />
                <Route path="/onboarding/loading" element={<LoadingStep />} />
                <Route path="/onboarding/results" element={<ResultsStep />} />
                <Route path="/onboarding/meal-plan-view" element={<MealPlanView />} />
                <Route path="/onboarding/payment" element={<PaymentStep />} />
                <Route path="/recipe-homepage" element={<RecipeHomepage />} />
                <Route path="/recipe" element={<RecipeHomepage />} />
                <Route path="/day/:dayNumber" element={<DayMealsView />} />
                <Route path="/recipe/:mealId/:dayNumber" element={<RecipeDetailPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </RecipeProvider>
          </OnboardingProvider>
        </AuthProvider> {/* CLOSE THE WRAPPER */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
