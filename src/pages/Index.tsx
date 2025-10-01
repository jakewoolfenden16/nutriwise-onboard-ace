import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg text-primary">NutriWise</span>
          </div>

          {/* Headline */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Your Personalised
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Nutrition Journey
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get a custom meal plan tailored to your goals, preferences, and lifestyle. 
              Join thousands achieving lasting results.
            </p>
          </div>

          {/* CTA */}
          <div className="animate-slide-up">
            <Button
              size="lg"
              onClick={() => navigate('/onboarding/gender')}
              className="h-16 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              Start Your Journey
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Takes just 2 minutes · Free 7-day trial
            </p>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16 animate-bounce-in">
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground">5,000+</p>
              <p className="text-sm text-muted-foreground">Active users</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground">2×</p>
              <p className="text-sm text-muted-foreground">Better results</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
              <Award className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground">4.8</p>
              <p className="text-sm text-muted-foreground">Average rating</p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 space-y-6 text-left max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Why NutriWise?</h2>
            
            <div className="space-y-4">
              {[
                {
                  icon: Sparkles,
                  title: 'AI-Powered Personalisation',
                  description: 'Get a plan that adapts to your unique body, goals, and preferences.',
                },
                {
                  icon: TrendingUp,
                  title: 'Sustainable Results',
                  description: 'No crash diets. Build healthy habits that last a lifetime.',
                },
                {
                  icon: Award,
                  title: 'Expert Guidance',
                  description: 'Backed by nutritional science and thousands of success stories.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md transition-all"
                >
                  <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 p-8 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-xl">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-primary-foreground">
                Ready to transform your nutrition?
              </h3>
              <p className="text-primary-foreground/90">
                Start your personalised plan today. No commitment required.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/onboarding/gender')}
                className="h-14 px-10 text-lg font-semibold mt-4"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
