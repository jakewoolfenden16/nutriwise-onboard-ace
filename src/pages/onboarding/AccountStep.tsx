import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User } from 'lucide-react';

export default function AccountStep() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updateData, setCurrentStep } = useOnboarding();
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log(`🚀 Starting ${mode} process`);
    
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (mode === 'signup') {
        console.log('📝 Creating account for:', email);
        
        // Create account using your AuthContext
        await signup({ email, password, name });
        
        console.log('✅ Account created - user needs to verify email');
        
        // Show success message about email verification
        setError('Account created! Please check your email to verify your account, then login.');
        setMode('login');
        setIsLoading(false);
        return;
      } else {
        console.log('🔐 Logging in:', email);
        
        // Login using your AuthContext
        await login({ email, password });
        
        console.log('✅ Login successful, token stored');

        // Save email to context
        updateData({ email });

        // Navigate to loading screen where meal plan generation happens
        console.log('➡️ Navigating to loading screen');
        setCurrentStep(21);
        navigate('/onboarding/loading');
      }

    } catch (err) {
      console.error(`❌ ${mode} failed:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${mode}`);
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout
      title={mode === 'signup' ? 'Create your account' : 'Welcome back!'}
      subtitle={mode === 'signup' ? 'Join thousands getting personalized meal plans' : 'Login to access your meal plan'}
      hideProgress
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-secondary rounded-lg">
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'signup'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Login
          </button>
        </div>

        {/* Name Input (only for signup) */}
        {mode === 'signup' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Error/Success Message */}
        {error && (
          <div className={`${
            error.includes('verify') ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'
          } border rounded-lg p-4 text-center`}>
            <p className={`text-sm ${error.includes('verify') ? 'text-primary' : 'text-destructive'}`}>
              {error}
            </p>
          </div>
        )}

        {/* Terms (only for signup) */}
        {mode === 'signup' && (
          <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>

      <NavigationButtons
        onNext={handleSubmit}
        nextLabel={
          isLoading
            ? mode === 'signup'
              ? 'Creating account...'
              : 'Logging in...'
            : mode === 'signup'
            ? 'Create account'
            : 'Login & generate plan'
        }
        hideBack
        nextDisabled={isLoading || !email || !password || (mode === 'signup' && !name)}
      />
    </OnboardingLayout>
  );
}