import React from 'react';
import { Search, MapPin } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="h-20 bg-white border-b border-neutral-200 px-6 md:px-10 flex items-center justify-between sticky top-0 md:static z-30">
      <div className="flex items-center space-x-4">
        <div className="bg-neutral-100 px-4 py-2 rounded-full flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] md:text-xs font-medium text-neutral-600">
            Delivering to: <span className="text-neutral-900">West Riverside, Apt 402</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search produce..." 
              onChange={(e) => onSearch(e.target.value)}
              className="bg-neutral-100 border-none rounded-full px-10 py-2 text-sm w-64 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
