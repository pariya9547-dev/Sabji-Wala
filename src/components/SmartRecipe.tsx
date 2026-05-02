import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, ChefHat, Timer, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface SmartRecipeProps {
  ingredients: CartItem[];
}

export const SmartRecipe: React.FC<SmartRecipeProps> = ({ ingredients }) => {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<{
    title: string;
    description: string;
    steps: string[];
    time: string;
    difficulty: string;
  } | null>(null);

  const generateRecipe = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Based on these fresh ingredients: ${ingredients.map(i => i.name).join(', ')}, suggest one delicious and easy recipe. 
      Return the response in JSON format with these exact keys: title, description, steps (array of strings), time, difficulty.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const data = JSON.parse(response.text || '{}');
      setRecipe(data);
    } catch (error) {
      console.error("AI Recipe creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-brand-900 to-green-950 rounded-[40px] p-8 text-white card-shadow overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-400 font-bold text-sm uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered Suggestions
            </div>
            <h2 className="text-4xl font-display font-bold">What's for dinner tonight?</h2>
            <p className="text-brand-100/60 mt-2">Let our smart chef suggest a meal based on your basket.</p>
          </div>
          
          <button 
            onClick={generateRecipe}
            disabled={loading || ingredients.length === 0}
            className="flex items-center justify-center gap-2 bg-brand-500 text-brand-950 px-8 py-4 rounded-2xl font-bold hover:bg-brand-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ChefHat className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            {recipe ? 'Suggest Another' : 'Get Recipe Suggestion'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!recipe && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-brand-400" />
              </div>
              <p className="text-xl font-medium text-white/50 italic font-display">
                {ingredients.length === 0 
                  ? "Add ingredients to your cart to unlock AI recipes" 
                  : "Click the button to generate a unique recipe with your items"}
              </p>
            </motion.div>
          )}

          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-brand-400 mb-4" />
              <p className="text-brand-200 font-medium animate-pulse">Our AI Chef is preparing something special...</p>
            </motion.div>
          )}

          {recipe && !loading && (
            <motion.div 
              key="recipe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white/10 rounded-3xl p-6 border border-white/10 h-full">
                  <h3 className="text-2xl font-display font-bold mb-4">{recipe.title}</h3>
                  <p className="text-brand-100/70 text-sm leading-relaxed mb-6">{recipe.description}</p>
                  
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-400">
                      <Timer className="w-4 h-4" />
                      {recipe.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-400">
                      <Flame className="w-4 h-4" />
                      {recipe.difficulty}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h4 className="text-lg font-bold text-brand-400 uppercase tracking-wider mb-2">Instructions</h4>
                <div className="grid gap-4">
                  {recipe.steps.map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/5 rounded-2xl p-4 border border-white/5 flex gap-4"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 text-brand-950 font-bold flex items-center justify-center text-sm">
                        {i + 1}
                      </span>
                      <p className="text-brand-100 text-sm py-1">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper for empty state icon
const ShoppingCart = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);
