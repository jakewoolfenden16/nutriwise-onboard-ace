import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useAuth } from '@/contexts/AuthContext';
import { useRecipe } from '@/contexts/RecipeContext';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { refreshWeeklyPlan } = useRecipe();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await login({ email, password });

      try {
        await refreshWeeklyPlan();
      } catch (refreshError) {
        console.warn('LoginPage: Unable to refresh weekly plan after login:', refreshError);
      }

      navigate('/recipe-homepage');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/onboarding/account');
  };

  return (
    <OnboardingLayout
      title="Log in to your account"
      subtitle="Access your personalised meal plan and recipes"
      hideProgress
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Forgot your password?{' '}
          <a href="/reset-password" className="text-primary hover:underline">
            Reset it here
          </a>
        </p>

        <p className="text-sm text-center text-muted-foreground">
          Need an account?{' '}
          <button
            type="button"
            onClick={handleCreateAccount}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            Create one
          </button>
        </p>

        <NavigationButtons
          onNext={() => handleSubmit()}
          nextLabel={isLoading ? 'Logging in...' : 'Log in'}
          hideBack
          nextDisabled={isLoading || !email || !password}
          nextButtonType="button"
        />
      </form>
    </OnboardingLayout>
  );
}
