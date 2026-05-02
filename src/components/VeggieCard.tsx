import React from 'react';
import { Plus } from 'lucide-react';
import { Vegetable } from '../types';
import { motion } from 'motion/react';

interface VeggieCardProps {
  vegetable: Vegetable;
  onAddToCart: (veg: Vegetable) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Marrow': 'bg-orange-50',
  'Leafy': 'bg-green-50',
  'Root': 'bg-red-50',
  'Cruciferous': 'bg-purple-50',
  'Allium': 'bg-blue-50',
};

export const VeggieCard: React.FC<VeggieCardProps> = ({ vegetable, onAddToCart }) => {
  const bgColor = CATEGORY_COLORS[vegetable.category] || 'bg-neutral-50';

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-5 flex flex-col hover:border-brand-200 transition-colors group">
      <div className={`w-full h-32 ${bgColor} rounded-xl mb-4 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02]`}>
        <img 
          src={vegetable.image} 
          alt={vegetable.name} 
          className="w-full h-full object-cover mix-blend-multiply opacity-90"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <h3 className="font-bold text-sm text-neutral-900 mb-0.5">{vegetable.name}</h3>
      <p className="text-[10px] text-neutral-400 mb-4 italic">{vegetable.description.substring(0, 40)}...</p>
      
      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-brand-700 text-lg">₹{vegetable.price}</span>
          <span className="text-[9px] text-neutral-400 -mt-1 font-medium">per {vegetable.unit}</span>
        </div>
        <button 
          onClick={() => onAddToCart(vegetable)}
          className="w-9 h-9 bg-neutral-900 text-white rounded-lg flex items-center justify-center text-xl leading-none pb-1 hover:bg-brand-700 transition-colors active:scale-90"
        >
          +
        </button>
      </div>
    </div>
  );
};
