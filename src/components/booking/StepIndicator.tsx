import React from 'react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, label: 'Destinazione', icon: '📍' },
  { id: 2, label: 'Grotta',       icon: '🪨' },
  { id: 3, label: 'Date & Gruppo',icon: '📅' },
  { id: 4, label: 'Conferma',     icon: '✅' },
];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
            currentStep === step.id
              ? "bg-stone-800 text-white"
              : currentStep > step.id
              ? "bg-stone-200 text-stone-600"
              : "bg-stone-100 text-stone-400"
          )}>
            <span>{step.icon}</span>
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn("h-px w-6 bg-stone-300",
              currentStep > step.id && "bg-stone-600")} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
