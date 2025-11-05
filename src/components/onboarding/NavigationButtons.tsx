import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
  nextButtonType?: 'button' | 'submit';
}

export const NavigationButtons = ({ 
  onNext, 
  onBack, 
  nextLabel = "Continue", 
  nextDisabled = false,
  hideBack = false,
  nextButtonType = 'button'
}: NavigationButtonsProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex gap-3 mt-8">
      {!hideBack && (
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex-1 h-14 text-base font-semibold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
      )}
      <Button
        onClick={onNext}
        disabled={nextDisabled}
        type={nextButtonType}
        className="flex-1 h-14 text-base font-semibold"
      >
        {nextLabel}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};
