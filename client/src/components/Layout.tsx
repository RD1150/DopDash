import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background flex justify-center overflow-hidden relative">
      {/* Background Texture/Gradient */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" aria-hidden="true">
        <img 
          src="/images/hero-calm.jpg" 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Mobile Container */}
      <div className={cn(
        "w-full max-w-md h-full min-h-screen relative z-10 flex flex-col p-6 md:p-8",
        className
      )}>
        {children}
      </div>
    </div>
  );
}
