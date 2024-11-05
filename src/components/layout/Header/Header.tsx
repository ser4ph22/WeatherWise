// C:\Users\seanp\VS\weatherwise\src\components\layout\Header\Header.tsx
import React from 'react';
import { Cloud } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center space-x-2">
          <Cloud className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-lg">WeatherWise</span>
        </div>
        <nav className="flex flex-1 items-center justify-end space-x-4">
          <button className="text-sm font-medium transition-colors hover:text-primary">
            Settings
          </button>
          <button className="text-sm font-medium transition-colors hover:text-primary">
            Favorites
          </button>
        </nav>
      </div>
    </header>
  );
};