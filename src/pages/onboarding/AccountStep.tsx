import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AccountStep() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Make sure to get 'data' from the context
  const { data, updateData } = useOnboarding();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log('🚀 Starting signup process');
    console.log('📋 Form data:', { email, name, password: '***' });
    console.log('📊 Context data available:', !!data);
    
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Basic password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Gather all questionnaire data from context (with safe optional chaining)
      const questionnaireData = data ? {
        gender: data.gender,
        workoutFrequency: data.workoutFrequency,
        height: data.height,
        weight: data.weight,
        heightUnit: data.heightUnit,
        weightUnit: data.weightUnit,
        age: data.age,
        overallGoal: data.overallGoal,
        weightGoal: data.weightGoal,
        weeklyWeightLoss: data.weeklyWeightLoss,
        specificDiet: data.specificDiet,
        cuisinePreferences: data.cuisinePreferences,
        otherNotes: data.otherNotes,
        foodsToAvoid: data.foodsToAvoid,
        motivation: data.motivation,
        motivationOther: data.motivationOther,
        mealPreferences: data.mealPreferences,
        fasting: data.fasting,
      } : null;

      console.log('📝 Calling signup API for:', email);
      console.log('📊 Questionnaire data:', questionnaireData);
      
      // Store in localStorage as fallback if we have questionnaire data
      if (questionnaireData) {
        localStorage.setItem('pendingQuestionnaire', JSON.stringify(questionnaireData));
      }
      
      // Create account with questionnaire data (if available)
      await signup({ 
        email, 
        password, 
        name,
        questionnaire_data: questionnaireData || undefined
      });
      
      console.log('✅ Signup API call completed successfully');
      console.log('📧 Verification email should be sent');
      if (questionnaireData) {
        console.log('💾 Questionnaire data stored in auth metadata');
      } else {
        console.log('⚠️ No questionnaire data found - user can complete it later');
      }
      
      // Save email to context for later use
      updateData({ email });
      
      // Show success message
      setSuccessMessage(
        '🎉 Account created! Check your email to verify your account. ' +
        'After clicking the verification link, you\'ll be automatically redirected to complete your meal plan setup.'
      );
      
      // Clear form for security
      setEmail('');
      setPassword('');
      setName('');
      setShowPassword(false);

    } catch (err) {
      console.error('❌ Signup failed:', err);
      console.error('❌ Error details:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
      console.log('🏁 Signup process finished');
    }
  };

  const handleLoginRedirect = () => {
    // Navigate to separate login page
    navigate('/login');
  };

  return (
    <OnboardingLayout
      title="Create your account"
      subtitle="Join thousands getting personalized meal plans"
      hideProgress
    >
      <div className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

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
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-10 pr-12 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-primary text-center">
              {successMessage}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive text-center">
              {error}
            </p>
          </div>
        )}

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground">
          By creating an account, you agree to our{' '}
          <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
        </p>

        {/* Login Link */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={handleLoginRedirect}
              className="text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              Log in
            </button>
          </p>
        </div>
      </div>

      <NavigationButtons
        onNext={handleSubmit}
        nextLabel={isLoading ? 'Creating account...' : 'Create account'}
        hideBack
        nextDisabled={isLoading || !email || !password || !name}
      />
    </OnboardingLayout>
  );
}