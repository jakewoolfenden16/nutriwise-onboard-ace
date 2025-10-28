import { useState, useEffect } from 'react';
import { Confetti } from '@/components/onboarding/Confetti';
import { DayCard } from '@/components/recipe/DayCard';
import { TipCard } from '@/components/recipe/TipCard';
import { BottomNavigation } from '@/components/recipe/BottomNavigation';
import { WeeklyTargetsCard } from '@/components/recipe/WeeklyTargetsCard';
import { EstimatedWeightCard } from '@/components/recipe/EstimatedWeightCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

import { useRecipe } from '@/contexts/RecipeContext';

export default function RecipeHomepage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const { mealPlans, currentDay, userName, weeklyTargets, estimatedWeightChange } = useRecipe();

  useEffect(() => {
    const confettiTimer = setTimeout(() => setShowConfetti(false), 4000);
    const contentTimer = setTimeout(() => setShowContent(true), 300);
    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(contentTimer);
    };
  }, []);

const exportToPDF = async () => {
  // Hide confetti and bottom nav for cleaner PDF
  setShowConfetti(false);
  
  // Get the main content
  const element = document.getElementById('meal-plan-content');
  if (!element) return;
  
  // Wait a moment for renders to complete
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Capture as image
  const canvas = await html2canvas(element, {
    scale: 2, // Higher quality
    useCORS: true,
    logging: false,
  });
  
  const imgData = canvas.toDataURL('image/png');
  
  // Create PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${userName || 'meal'}-plan.pdf`);
};


  const personalizedTips = [
    "💧 Start your day with a glass of lemon water to boost metabolism",
    "🥗 Prep your meals on Sunday to stay consistent all week",
    "🏃‍♂️ A 10-minute walk after meals helps with digestion",
    "😴 Aim for 7-8 hours of sleep to support your fitness goals"
  ];

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div id="meal-plan-content" className="min-h-screen bg-background pb-24">
        {/* Personalized Header */}
        <div className={`pt-6 pb-4 px-4 transition-all duration-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            <h1 
              className="text-3xl md:text-4xl font-bold text-center text-foreground font-['Montserrat']"
              style={{ paddingTop: '24px', paddingBottom: '16px' }}
            >
              {userName ? `${userName}'s personalised nutrition plan` : 'Your personalised nutrition plan'}
            </h1>
            <button
              onClick={exportToPDF}
              className="mt-4 mx-auto flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              <Download size={20} />
              Export to PDF
            </button>
          </div>
        </div>

        {/* Weekly Targets & Weight Estimate */}
        <div className={`px-4 mb-6 transition-all duration-700 delay-150 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="max-w-screen-xl mx-auto space-y-3">
            <div className="mb-4">
              <WeeklyTargetsCard targets={weeklyTargets} />
            </div>
            <EstimatedWeightCard weightChange={estimatedWeightChange} />
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
        <div className={`px-4 mb-8 transition-all duration-700 delay-450 ${
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
      </div>

      <BottomNavigation />
    </>
  );
}
