import React from 'react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  return (
    <section className="h-auto md:h-56 bg-brand-800 rounded-[2rem] relative overflow-hidden flex items-center mb-8 mx-6 mt-10 md:mt-2">
      <div className="w-full md:w-1/2 p-8 md:p-12 relative z-10">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
          Daily <span className="font-bold">Harvest</span>
        </h2>
        <p className="text-brand-100 opacity-80 mb-6 text-sm max-w-sm">
          Premium organic vegetables sourced directly from local farmers in Kent.
        </p>
        <button className="bg-white text-brand-800 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">
          Explore Seasonal
        </button>
      </div>
      
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-brand-700/30 hidden md:flex items-center justify-center border-l border-white/10">
        <div className="grid grid-cols-3 gap-6 p-8">
           <motion.div 
             animate={{ y: [0, -10, 0] }} 
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl shadow-sm backdrop-blur-sm"
           >
             🥕
           </motion.div>
           <motion.div 
             animate={{ y: [0, 10, 0] }} 
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl shadow-sm backdrop-blur-sm"
           >
             🥦
           </motion.div>
           <motion.div 
             animate={{ y: [0, -5, 0] }} 
             transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
             className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl shadow-sm backdrop-blur-sm"
           >
             🍅
           </motion.div>
        </div>
      </div>
      
      {/* Abstract geometric background element */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
    </section>
  );
};
;
