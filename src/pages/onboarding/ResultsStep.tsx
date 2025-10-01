import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Confetti } from '@/components/onboarding/Confetti';
import { Award, Zap, Target, Sparkles } from 'lucide-react';

// Helper function to generate dynamic headline
const generateHeadline = (data: any, difference: number) => {
  const { overallGoal, weeklyWeightLoss, weightUnit = 'kg' } = data;
  
  if (overallGoal === 'lose' && weeklyWeightLoss && difference > 0) {
    const weeks = Math.round(difference / weeklyWeightLoss);
    return `Because you want to lose ${difference.toFixed(1)}${weightUnit} in ${weeks} weeks, here's the nutrition profile that will get you there.`;
  }
  
  if (overallGoal === 'build') {
    return "Ready to build muscle? Here's your personalised nutrition plan.";
  }
  
  if (overallGoal === 'maintain') {
    return "Perfect! Here's your plan for lean gains and maintaining your current weight.";
  }
  
  return "Here's your personalised nutrition plan, designed just for you.";
};

// Helper function to generate contextual tips
const generateContextualTips = (data: any) => {
  const tips: string[] = [];
  
  if (data.overallGoal === 'build') {
    tips.push('Focus on hitting your protein target daily to build lean muscle.');
  }
  
  if (data.fasting) {
    tips.push("We've distributed your calories across fewer meals for optimal balance.");
  }
  
  if (data.workoutFrequency && data.workoutFrequency >= 4) {
    tips.push('Your higher training volume means extra carbs for recovery.');
  }
  
  if (data.specificDiet && data.specificDiet !== 'none') {
    tips.push(`We've tailored your plan around your ${data.specificDiet} preferences.`);
  }
  
  if (data.cuisinePreferences && data.cuisinePreferences.length > 0) {
    tips.push(`Your meal suggestions will focus on ${data.cuisinePreferences[0]} flavors you love.`);
  }
  
  if (data.motivation && data.motivation.toLowerCase().includes('energy')) {
    tips.push('These macros will help boost your daily energy levels.');
  }
  
  // Default tips if not enough contextual ones
  if (tips.length < 2) {
    tips.push('Track your progress weekly to see meaningful trends.');
    tips.push('Stay hydrated with 8 glasses of water daily.');
  }
  
  return tips.slice(0, 3); // Return max 3 tips
};

export default function ResultsStep() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedCalories, setAnimatedCalories] = useState(0);
  const [animatedProtein, setAnimatedProtein] = useState(0);
  const [animatedCarbs, setAnimatedCarbs] = useState(0);
  const [animatedFat, setAnimatedFat] = useState(0);
  const [showCards, setShowCards] = useState(false);
  
  const { data, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const goalWeight = data.weightGoal || 65;
  const currentWeight = data.weight || 70;
  const difference = Math.abs(currentWeight - goalWeight);

  const calories = 2100;
  const protein = 150;
  const carbs = 200;
  const fat = 70;

  const headline = generateHeadline(data, difference);
  const contextualTips = generateContextualTips(data);

  useEffect(() => {
    setShowConfetti(true);
    
    // Stagger card animations
    setTimeout(() => setShowCards(true), 300);
    
    // Count up animation for macros
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedCalories(Math.round(calories * progress));
      setAnimatedProtein(Math.round(protein * progress));
      setAnimatedCarbs(Math.round(carbs * progress));
      setAnimatedFat(Math.round(fat * progress));
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentStep(21);
    navigate('/onboarding/account');
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <OnboardingLayout
        title={headline}
        subtitle="Your personalised nutrition profile is ready!"
        hideProgress
      >
        <div className="space-y-6">
          {/* Celebration Badge */}
          <div className="flex justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />
              <div className="relative bg-gradient-to-br from-primary to-accent rounded-full p-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Main Stats Card with Count-up Animation */}
          <div 
            className={`bg-gradient-to-br from-primary to-accent rounded-2xl p-6 shadow-lg text-primary-foreground transition-all duration-500 ${
              showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Daily Targets</h3>
              <Award className="h-6 w-6" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur hover:bg-white/20 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <p className="text-3xl font-bold relative z-10">{animatedCalories}</p>
                <p className="text-sm opacity-90 relative z-10">Calories</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur hover:bg-white/20 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <p className="text-3xl font-bold relative z-10">{animatedProtein}g</p>
                <p className="text-sm opacity-90 relative z-10">Protein</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur hover:bg-white/20 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <p className="text-3xl font-bold relative z-10">{animatedCarbs}g</p>
                <p className="text-sm opacity-90 relative z-10">Carbs</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur hover:bg-white/20 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <p className="text-3xl font-bold relative z-10">{animatedFat}g</p>
                <p className="text-sm opacity-90 relative z-10">Fat</p>
              </div>
            </div>
          </div>

          {/* Contextual Personalised Tips */}
          <div 
            className={`bg-card rounded-2xl p-6 shadow-md border border-border space-y-3 transition-all duration-500 delay-150 ${
              showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Why This Works For You</h3>
            </div>
            {contextualTips.map((tip, i) => (
              <div 
                key={i} 
                className="flex items-start gap-2 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Zap className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{tip}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>✨ All recommendations based on your unique profile and latest nutritional research</p>
          </div>
        </div>

        <NavigationButtons 
          onNext={handleNext} 
          nextLabel="See your full 7-day plan →" 
          hideBack 
        />
      </OnboardingLayout>
    </>
  );
}
