import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn(
        "bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 overflow-hidden logo-shadow p-1",
        sizes[size]
      )}>
        <img 
          src="https://waterpumpservices.co.za/Images/logo.png" 
          alt="WPS Logo"
          className="w-full h-full object-contain logo-glow"
          onError={(e) => {
            // Fallback to stylized text if image fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement as HTMLDivElement;
            parent.style.backgroundColor = '#005bb7';
            const text = parent.querySelector('#logo-text-fallback') as HTMLDivElement;
            if (text) text.style.display = 'block';
          }}
        />
        <div className="hidden font-[900] text-white italic tracking-tighter text-center" id="logo-text-fallback">
          WPS
        </div>
      </div>
    </div>
  );
}
