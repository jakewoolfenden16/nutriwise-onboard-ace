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
              Hit Your Protein Targets.
              <br />
              <span className="text-primary">Build Lean Muscle.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Custom meal plans for gym-goers who take training seriously. No fluff. No guesswork. Just meals that match your macros.
            </p>
          </div>

          {/* CTA */}
          <div className="animate-slide-up pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/onboarding/gender')}
              className="h-16 px-12 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4 font-medium">
              2-minute setup · Free 7-day trial · Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Why NutriWise Section */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
              Nutrition that actually fuels your training.
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Target,
                  title: 'Macro-Accurate Plans',
                  description: 'Dial in your protein, carbs, and fats for your goal, whether that\'s cutting, bulking, or maintenance.',
                },
                {
                  icon: Dumbbell,
                  title: 'Gym-Day Sync',
                  description: 'Rest-day vs training-day plans that adjust your calories and macros automatically.',
                },
                {
                  icon: UtensilsCrossed,
                  title: 'Serious Food, Simple Prep',
                  description: 'Meals designed for strength. Quick to make, easy to track.',
                },
                {
                  icon: Brain,
                  title: 'AI + Science Backed',
                  description: 'Built on sports nutrition research and real-world data from gym-goers.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-6 p-8 bg-card rounded-xl border-2 border-border hover:border-primary transition-all"
                >
                  <div className="bg-primary rounded-lg p-4 flex-shrink-0">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
              Real progress. Real numbers.
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-16">
              Results from lifters who take nutrition seriously.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  metric: '+4 kg',
                  detail: 'lean mass in 8 weeks',
                },
                {
                  metric: '−3 kg',
                  detail: 'fat, same strength output',
                },
                {
                  metric: '100%',
                  detail: 'adherence with zero burnout',
                },
              ].map((result, i) => (
                <div
                  key={i}
                  className="text-center p-8 bg-card rounded-xl border-2 border-border"
                >
                  <div className="text-5xl font-extrabold text-primary mb-3">{result.metric}</div>
                  <div className="text-muted-foreground font-medium">{result.detail}</div>
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
              Stop guessing. Start growing.
            </h3>
            <p className="text-xl text-background/80 font-medium">
              Get your high-protein plan today — tailored to your workouts.
            </p>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/onboarding/gender')}
              className="h-16 px-12 text-lg font-bold mt-6 bg-background text-foreground border-2 border-background hover:bg-background/90"
            >
              Start My Plan Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
