import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Confetti } from '@/components/onboarding/Confetti';
import { ProgressCard } from '@/components/recipe/ProgressCard';
import { DayCard } from '@/components/recipe/DayCard';
import { TodaysFocus } from '@/components/recipe/TodaysFocus';
import { TipCard } from '@/components/recipe/TipCard';
import { BottomNavigation } from '@/components/recipe/BottomNavigation';

import { useRecipe } from '@/contexts/RecipeContext';

export default function RecipeHomepage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const { mealPlans, currentDay, healthScore } = useRecipe();

  useEffect(() => {
    const confettiTimer = setTimeout(() => setShowConfetti(false), 4000);
    const contentTimer = setTimeout(() => setShowContent(true), 300);
    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const todaysPlan = mealPlans[currentDay - 1];

  const personalizedTips = [
    "💧 Start your day with a glass of lemon water to boost metabolism",
    "🥗 Prep your meals on Sunday to stay consistent all week",
    "🏃‍♂️ A 10-minute walk after meals helps with digestion",
    "😴 Aim for 7-8 hours of sleep to support your fitness goals"
  ];

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="min-h-screen bg-background pb-24">
        {/* Hero Section */}
        <div className={`bg-gradient-to-b from-primary/10 via-background to-background pt-8 pb-6 px-4 transition-all duration-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-primary/10 rounded-full p-3 animate-pulse">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-2 font-['Montserrat']">
              Your personalised 7-day plan is here 🎉
            </h1>
            
            <p className="text-center text-muted-foreground text-base md:text-lg mb-6">
              Let's fuel your goals, one meal at a time
            </p>

            <div className="max-w-sm mx-auto">
              <ProgressCard score={healthScore} />
            </div>
          </div>
        </div>

        {/* Today's Focus - Sticky */}
        <div className={`px-4 mb-6 transition-all duration-700 delay-200 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            <TodaysFocus plan={todaysPlan} />
          </div>
        </div>

        {/* 7-Day Plan - Vertical Stack */}
        <div className={`mb-8 transition-all duration-700 delay-300 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="px-4 mb-4 max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground font-['Montserrat']">Your 7-Day Plan</h2>
          </div>
          
          <div className="px-4 space-y-3 max-w-screen-xl mx-auto">
            {mealPlans.map((plan) => (
              <DayCard key={plan.day} plan={plan} isToday={plan.day === currentDay} />
            ))}
          </div>
        </div>

        {/* Personalized Tips */}
        <div className={`px-4 mb-8 transition-all duration-700 delay-400 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-['Montserrat']">Personalized Tips</h2>
            <div className="space-y-3">
              {personalizedTips.map((tip, index) => (
                <TipCard key={index} tip={tip} delay={index * 100} />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className={`px-4 mb-8 transition-all duration-700 delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-['Montserrat']">Today's Macros</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Protein</p>
                <p className="text-2xl font-bold text-foreground">{todaysPlan.macros.protein}g</p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-3/4 animate-fade-in" />
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                <p className="text-2xl font-bold text-foreground">{todaysPlan.macros.carbs}g</p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-4/5 animate-fade-in" />
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Fat</p>
                <p className="text-2xl font-bold text-foreground">{todaysPlan.macros.fat}g</p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-2/3 animate-fade-in" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
