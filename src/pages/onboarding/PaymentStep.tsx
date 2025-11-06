import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
            7 Days of Dialled In Nutrition.
          </h1>

          {/* CTA Button */}
          <button
            onClick={handlePurchase}
            disabled={isGenerating}
            className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating your meal plan...
              </>
            ) : (
              'Get Your 7-Day Plan →'
            )}
          </button>
        </div>

        {/* What You Get */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-10 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">What You Get</h2>
          <p className="text-foreground leading-relaxed mb-4">
            A complete 7-day meal plan with breakfast, lunch, dinner, and snacks hitting your exact macro targets.
          </p>
          <p className="text-foreground leading-relaxed">
            Each meal comes with step-by-step recipes, prep times, and full macro breakdowns.
          </p>
        </div>

        {/* Why You'll Love It */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-10 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">Why You'll Love It</h2>
          <div className="space-y-3">
            {[
              'More protein. Less guesswork.',
              "Meals you'll actually enjoy eating.",
              'Your macros dialled in for the week.',
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
        <div className="flex justify-center">
          <button
            onClick={handlePurchase}
            disabled={isGenerating}
            className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating your meal plan...
              </>
            ) : (
              'Get Your 7-Day Plan →'
            )}
          </button>
        </div>

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
