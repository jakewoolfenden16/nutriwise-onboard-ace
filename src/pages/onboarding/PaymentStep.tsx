import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Check, Star, Users } from 'lucide-react';

export default function PaymentStep() {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/');
  };

  return (
    <OnboardingLayout
      title="Start your free trial"
      subtitle="7 days free, then £9.99/month"
      hideProgress
    >
      <div className="space-y-6">
        {/* Trust Elements */}
        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Trusted by 5,000+ users</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">4.8/5</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground italic">
              "NutriWise helped me lose 12kg in 3 months. The personalised meal plans are fantastic!"
            </p>
            <p className="text-xs text-muted-foreground mt-2">— Sarah M., London</p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border space-y-3">
          <h3 className="font-semibold mb-4">What's included:</h3>
          {[
            'Personalised meal plans tailored to your goals',
            'Daily macro tracking and nutrition insights',
            'Weekly progress reports and adjustments',
            'Recipe library with 1,000+ healthy meals',
            'AI-powered nutrition coach',
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{feature}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-primary-foreground">
          <div className="text-center space-y-2">
            <p className="text-sm opacity-90">Start free for 7 days</p>
            <p className="text-5xl font-bold">£9.99</p>
            <p className="text-sm opacity-90">per month after trial</p>
            <p className="text-xs opacity-75 mt-4">Cancel anytime, no commitment</p>
          </div>
        </div>

        <Button onClick={handleStartTrial} className="w-full h-14 text-lg font-semibold">
          Start Free Trial →
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You won't be charged until your trial ends. Cancel anytime from settings.
        </p>
      </div>
    </OnboardingLayout>
  );
}
