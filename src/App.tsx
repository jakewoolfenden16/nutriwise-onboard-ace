import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { DeveloperNav } from "@/components/onboarding/DeveloperNav";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Onboarding pages
import GenderStep from "./pages/onboarding/GenderStep";
import WorkoutStep from "./pages/onboarding/WorkoutStep";
import InfoSustainable from "./pages/onboarding/InfoSustainable";
import MeasurementsStep from "./pages/onboarding/MeasurementsStep";
import AgeStep from "./pages/onboarding/AgeStep";
import WeightGoalStep from "./pages/onboarding/WeightGoalStep";
import OverallGoalStep from "./pages/onboarding/OverallGoalStep";
import InfoProgress from "./pages/onboarding/InfoProgress";
import GoalSpeedStep from "./pages/onboarding/GoalSpeedStep";
import InfoComparison from "./pages/onboarding/InfoComparison";
import DietStep from "./pages/onboarding/DietStep";
import CuisineStep from "./pages/onboarding/CuisineStep";
import AvoidStep from "./pages/onboarding/AvoidStep";
import MotivationStep from "./pages/onboarding/MotivationStep";
import InfoPersonalising from "./pages/onboarding/InfoPersonalising";
import MealPreferencesStep from "./pages/onboarding/MealPreferencesStep";
import FastingStep from "./pages/onboarding/FastingStep";
import LoadingStep from "./pages/onboarding/LoadingStep";
import ResultsStep from "./pages/onboarding/ResultsStep";
import AccountStep from "./pages/onboarding/AccountStep";
import PaymentStep from "./pages/onboarding/PaymentStep";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <OnboardingProvider>
        <BrowserRouter>
          <DeveloperNav />
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Onboarding Flow */}
            <Route path="/onboarding/gender" element={<GenderStep />} />
            <Route path="/onboarding/workout" element={<WorkoutStep />} />
            <Route path="/onboarding/info-sustainable" element={<InfoSustainable />} />
            <Route path="/onboarding/measurements" element={<MeasurementsStep />} />
            <Route path="/onboarding/age" element={<AgeStep />} />
            <Route path="/onboarding/weight-goal" element={<WeightGoalStep />} />
            <Route path="/onboarding/overall-goal" element={<OverallGoalStep />} />
            <Route path="/onboarding/info-progress" element={<InfoProgress />} />
            <Route path="/onboarding/goal-speed" element={<GoalSpeedStep />} />
            <Route path="/onboarding/info-comparison" element={<InfoComparison />} />
            <Route path="/onboarding/diet" element={<DietStep />} />
            <Route path="/onboarding/cuisine" element={<CuisineStep />} />
            <Route path="/onboarding/avoid" element={<AvoidStep />} />
            <Route path="/onboarding/motivation" element={<MotivationStep />} />
            <Route path="/onboarding/info-personalising" element={<InfoPersonalising />} />
            <Route path="/onboarding/meals" element={<MealPreferencesStep />} />
            <Route path="/onboarding/fasting" element={<FastingStep />} />
            <Route path="/onboarding/loading" element={<LoadingStep />} />
            <Route path="/onboarding/results" element={<ResultsStep />} />
            <Route path="/onboarding/account" element={<AccountStep />} />
            <Route path="/onboarding/payment" element={<PaymentStep />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </OnboardingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
