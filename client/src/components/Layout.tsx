import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className="w-full bg-background relative min-h-screen">
      {/* Background Texture/Gradient - Fixed */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" aria-hidden="true">
        <img 
          src="/images/hero-calm.jpg" 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Scrollable Content Container */}
      <div className="relative z-10 flex justify-center w-full">
        <div className={cn(
          "w-full max-w-md flex flex-col p-6 md:p-8",
          className
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}
