'use client';

import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Popover = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block w-full">{children}</div>;
};

const PopoverTrigger = ({ children, asChild, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

const PopoverContent = ({ children, className, align = 'center' }: any) => {
  return (
    <div className={cn(
      "absolute z-[100] mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200",
      align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2',
      className
    )}>
      {children}
    </div>
  );
};

export { Popover, PopoverTrigger, PopoverContent };
