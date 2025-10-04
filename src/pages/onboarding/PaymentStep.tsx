import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Clock, Lock, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function PaymentStep() {
  const navigate = useNavigate();

  const handlePurchase = () => {
    toast({
      title: "Payment Successful! 🎉",
      description: "Redirecting to your meal plan...",
    });
    
    setTimeout(() => {
      navigate('/recipe-homepage');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            1 Day of Meals.<br />150g+ Protein, Every Day.
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

        {/* Price Summary */}
        <div className="text-center mb-8">
          <p className="text-2xl font-bold text-foreground">Total value: £1.99</p>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handlePurchase} 
          className="w-full h-14 text-lg font-semibold mb-6"
        >
          Get My Plan for £1.99 →
        </Button>

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
      </div>
    </div>
  );
}
