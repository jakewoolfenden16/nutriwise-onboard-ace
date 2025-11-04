import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, Lock, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateWeeklyPlan } from '@/lib/api';
import { useRecipe } from '@/contexts/RecipeContext';

export default function PaymentStep() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshWeeklyPlan } = useRecipe();

  const handlePurchase = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      console.log('💳 Processing "payment"...');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ Payment successful, generating weekly plan...');

      // Generate the 7-day meal plan
      const result = await generateWeeklyPlan();

      console.log('✅ Weekly plan generated:', result);

      // Refresh the weekly plan in context so downstream views have latest data
      await refreshWeeklyPlan();

      toast({
        title: "Payment Successful! 🎉",
        description: "Your 7-day meal plan is ready!",
      });

      // Navigate to recipe homepage after short delay
      setTimeout(() => {
        navigate('/recipe-homepage');
      }, 1500);

    } catch (err) {
      console.error('❌ Failed to generate meal plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate meal plan');
      setIsGenerating(false);

      toast({
        title: "Error",
        description: "Failed to generate your meal plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            One Day. 150 g+ Protein. Dialled-In Nutrition.
          </h1>
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold">
            £1.99 – One-time payment
          </div>
        </div>

        {/* What You're Getting */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-10 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">What You're Getting</h2>
          <div className="space-y-4">
            {[
              'Complete 1-day meal plan — Breakfast, lunch, dinner, and snacks hitting your exact protein targets',
              'Detailed recipes — Step-by-step instructions, prep times, and macro breakdowns for every meal',
              'Macro tracking sheet — Daily protein, carbs, fat, and calorie totals that match your goals',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Perfect For */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-10 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">Perfect For</h2>
          <div className="space-y-3">
            {[
              'Build lean muscle faster with 150–200g protein daily',
              'Meal prep made simple — recipes you&apos;ll actually enjoy',
              'No more guesswork — hit your macros with confidence',
            ].map((item, i) => (
              <p key={i} className="text-foreground leading-relaxed">
                • {item}
              </p>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handlePurchase}
          disabled={isGenerating}
          className="w-full inline-flex items-center justify-center h-14 text-lg font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Generating your meal plan...
            </>
          ) : (
            'Get My Plan for £1.99 →'
          )}
        </button>

        {/* Trust Anchors */}
        <div className="flex items-center justify-center gap-6 mb-6 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Instant access</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4" />
            <span>No subscription</span>
          </div>
        </div>

        {/* Refund Statement */}
        <p className="text-center text-sm text-muted-foreground leading-relaxed">
          You&apos;ll get your 1-day high-protein plan instantly. If it&apos;s not for you, just drop us a message and we&apos;ll refund you.
        </p>

        {/* DEV MODE: Test button to skip to recipe homepage */}
        {import.meta.env.DEV && (
          <button
            onClick={() => navigate('/recipe-homepage')}
            className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            🔧 DEV: Skip to Recipe Homepage
          </button>
        )}
      </div>
    </div>
  );
}
