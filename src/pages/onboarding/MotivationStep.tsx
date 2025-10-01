import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Brain, Heart, TrendingDown } from 'lucide-react';

const motivations = [
  { value: 'energy', label: 'More energy', icon: Zap },
  { value: 'concentration', label: 'Better concentration', icon: Brain },
  { value: 'healthy', label: 'Healthier lifestyle', icon: Heart },
  { value: 'weight', label: 'Lose weight', icon: TrendingDown },
];

export default function MotivationStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState(data.motivation || '');
  const [other, setOther] = useState(data.motivationOther || '');
  const navigate = useNavigate();

  const handleNext = () => {
    updateData({ motivation: selected, motivationOther: other });
    setCurrentStep(15);
    navigate('/onboarding/info-motivational');
  };

  return (
    <OnboardingLayout
      title="Why are you doing this?"
      subtitle="Pick what matters most to you."
    >
      <div className="space-y-4">
        {motivations.map((motivation) => (
          <Button
            key={motivation.value}
            variant="card"
            onClick={() => setSelected(motivation.value)}
            className={selected === motivation.value ? 'border-primary bg-primary/5' : ''}
          >
            <motivation.icon className="mr-2 h-5 w-5" />
            {motivation.label}
          </Button>
        ))}

        <div className="space-y-2">
          <Button
            variant="card"
            onClick={() => setSelected('other')}
            className={selected === 'other' ? 'border-primary bg-primary/5' : ''}
          >
            Other reason
          </Button>
          
          {selected === 'other' && (
            <Input
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Tell us your motivation..."
              className="animate-fade-in"
            />
          )}
        </div>
      </div>

      <NavigationButtons 
        onNext={handleNext} 
        nextDisabled={!selected || (selected === 'other' && !other.trim())} 
      />
    </OnboardingLayout>
  );
}
