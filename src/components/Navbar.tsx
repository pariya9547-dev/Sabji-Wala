import React from 'react';
import { ShoppingBag, Search, Menu, User, Home, Grid, Wallet, Sprout } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onCartClick: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartClick, cartCount }) => {
  return (
    <>
      {/* Mobile Top Bar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-display font-black tracking-tighter text-brand-800 uppercase">Sabji<span className="text-brand-600">Wala</span></span>
        </div>
        <button onClick={onCartClick} className="relative p-2 bg-brand-100 rounded-lg text-brand-700">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{cartCount}</span>}
        </button>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-neutral-200 flex-col justify-between p-8 z-40">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-brand-700 rounded-lg flex items-center justify-center shadow-lg shadow-brand-700/20">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-black tracking-tighter text-brand-800 uppercase">Sabji<span className="text-brand-600">Wala</span></span>
          </div>
          
          <nav className="space-y-6">
            <a href="#" className="flex items-center space-x-4 text-brand-700 font-semibold group">
              <span className="w-2 h-2 bg-brand-700 rounded-full"></span>
              <span>Marketplace</span>
            </a>
            <a href="#" className="flex items-center space-x-4 text-neutral-400 hover:text-brand-600 transition-colors">
              <span className="w-2 h-2 bg-transparent rounded-full border border-neutral-300"></span>
              <span>Categories</span>
            </a>
            <a href="#" className="flex items-center space-x-4 text-neutral-400 hover:text-brand-600 transition-colors">
              <span className="w-2 h-2 bg-transparent rounded-full border border-neutral-300"></span>
              <span>My Harvest</span>
            </a>
            <a href="#" className="flex items-center space-x-4 text-neutral-400 hover:text-brand-600 transition-colors">
              <span className="w-2 h-2 bg-transparent rounded-full border border-neutral-300"></span>
              <span>Farm Wallet</span>
            </a>
          </nav>
        </div>

        <div className="p-6 bg-brand-100/50 rounded-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-800 mb-2">Loyalty Member</p>
          <p className="text-sm text-brand-700 leading-snug">
            You saved <span className="font-bold">₹3,500</span> this month on organic greens.
          </p>
        </div>
      </aside>
    </>
  );
};
