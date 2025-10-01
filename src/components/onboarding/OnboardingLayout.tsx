import { ReactNode } from 'react';
import { ProgressBar } from './ProgressBar';

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  hideProgress?: boolean;
}

export const OnboardingLayout = ({ children, title, subtitle, hideProgress = false }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-md animate-fade-in">
        {!hideProgress && <ProgressBar />}
        
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="animate-bounce-in">
          {children}
        </div>
      </div>
    </div>
  );
};
