import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dumbbell, Target, UtensilsCrossed, Brain, ArrowRight, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="inline-flex items-center gap-2 bg-foreground px-6 py-3 rounded-full">
            <Dumbbell className="h-5 w-5 text-background" />
            <span className="font-bold text-lg text-background">NutriWise</span>
          </div>

          {/* Headline */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
              Meal Plans That Match Your Macros
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Tell us about you and your goals. We'll build you a week of meals that hit your macros.
            </p>
          </div>

          {/* CTA */}
          <div className="animate-slide-up pt-4">
          <Button
            size="lg"
            onClick={() => navigate('/onboarding/gender')}
            className="h-16 px-12 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Build my plan in 2 minutes
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          </div>
        </div>
      </div>

      {/* Why NutriWise Section */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
              Here's how it works:
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: 'We Calculate Your Macros',
                  description: 'Not sure how much protein, carbs, or fat you need? We work it out based on your health stats, goals, and training frequency.',
                },
                {
                  icon: UtensilsCrossed,
                  title: 'Real Recipes from Professional Chefs',
                  description: 'No bland, generic meals. Every meal in your plan comes from our database of recipes created by actual chefs - so the food is epic.',
                },
                {
                  icon: Brain,
                  title: 'We Fixed AI Meal Planning',
                  description: 'Most AI meal planners hallucinate recipes or botch your macros. We don\'t.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-8 bg-card rounded-xl border-2 border-border hover:border-primary transition-all"
                >
                  <div className="bg-primary rounded-lg p-4 mb-4">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold text-background">
              You'll get a full 7-day plan.
            </h3>
            <p className="text-xl text-background/80 font-medium">
              Every meal mapped out. Every macro calculated. Just follow it.
            </p>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/onboarding/gender')}
              className="h-16 px-12 text-lg font-bold mt-6 bg-background text-foreground border-2 border-background hover:bg-background/90"
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
