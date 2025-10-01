import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function MeasurementsStep() {
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(data.heightUnit || 'cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(data.weightUnit || 'kg');
  const [height, setHeight] = useState(data.height || (heightUnit === 'cm' ? 170 : 5.7));
  const [weight, setWeight] = useState(data.weight || (weightUnit === 'kg' ? 70 : 154));
  const navigate = useNavigate();

  const handleNext = () => {
    updateData({ height, weight, heightUnit, weightUnit });
    setCurrentStep(5);
    navigate('/onboarding/age');
  };

  return (
    <OnboardingLayout
      title="Let's get your basics down"
      subtitle="What's your height and weight?"
    >
      <div className="space-y-6">
        {/* Unit Toggle */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={heightUnit === 'cm' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setHeightUnit('cm');
              setWeightUnit('kg');
              setHeight(170);
              setWeight(70);
            }}
          >
            Metric
          </Button>
          <Button
            variant={heightUnit === 'ft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setHeightUnit('ft');
              setWeightUnit('lbs');
              setHeight(5.7);
              setWeight(154);
            }}
          >
            Imperial
          </Button>
        </div>

        {/* Height */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-primary">
              {heightUnit === 'cm' ? height : height.toFixed(1)}
            </p>
            <p className="text-muted-foreground">{heightUnit === 'cm' ? 'cm' : 'ft'}</p>
          </div>
          <Slider
            value={[height]}
            onValueChange={(vals) => setHeight(vals[0])}
            max={heightUnit === 'cm' ? 220 : 7.5}
            min={heightUnit === 'cm' ? 140 : 4.5}
            step={heightUnit === 'cm' ? 1 : 0.1}
          />
        </div>

        {/* Weight */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-primary">
              {weightUnit === 'kg' ? weight : Math.round(weight)}
            </p>
            <p className="text-muted-foreground">{weightUnit}</p>
          </div>
          <Slider
            value={[weight]}
            onValueChange={(vals) => setWeight(vals[0])}
            max={weightUnit === 'kg' ? 150 : 330}
            min={weightUnit === 'kg' ? 40 : 88}
            step={weightUnit === 'kg' ? 0.5 : 1}
          />
        </div>
      </div>

      <NavigationButtons onNext={handleNext} />
    </OnboardingLayout>
  );
}
