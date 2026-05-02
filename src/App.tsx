import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VeggieCard } from './components/VeggieCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { SmartRecipe } from './components/SmartRecipe';
import { VEGETABLES, CATEGORIES } from './data/veggies';
import { Vegetable, CartItem, Category } from './types';
import { Instagram, Twitter, Facebook, Sprout, LayoutDashboard } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { auth, db, signInWithGoogle } from './lib/firebase';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [veggies, setVeggies] = useState<Vegetable[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const isAppOwner = user.email === 'pariya9547@gmail.com';
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists() || isAppOwner);
      } else {
        setIsAdmin(false);
      }
    });

    // Veggies Listener
    const unsubscribeVeggies = onSnapshot(collection(db, 'vegetables'), (snapshot) => {
      if (snapshot.empty) {
        setVeggies(VEGETABLES);
      } else {
        const veggiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vegetable[];
        setVeggies(veggiesData);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeVeggies();
    };
  }, []);

  const handleAdminLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const isAppOwner = user.email === 'pariya9547@gmail.com';
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      
      if (adminDoc.exists() || isAppOwner) {
        setIsAdmin(true);
        setView('admin');
      } else {
        alert("You are not authorized as an admin.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const totalAmount = subtotal > 0 ? subtotal + shipping : 0;

  const filteredVeggies = useMemo(() => {
    return veggies.filter(veg => {
      const matchesCategory = selectedCategory === 'All' || veg.category === selectedCategory;
      const matchesSearch = veg.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, veggies]);

  const handleAddToCart = (veg: Vegetable) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === veg.id);
      if (existing) {
        return prev.map(item => item.id === veg.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...veg, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  if (view === 'admin') {
    return <AdminPanel onBack={() => setView('customer')} />;
  }

  return (
    <div className="flex min-h-screen bg-brand-50 font-sans overflow-x-hidden">
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      
      <main className="flex-1 flex flex-col md:ml-64 relative min-w-0 pt-16 md:pt-0">
        <Header onSearch={setSearchQuery} />
        
        <div className="p-4 md:p-10 flex-1 flex flex-col gap-8 w-full max-w-7xl mx-auto">
          <Hero />

          {/* Seasonal Harvest Section */}
          <section className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900">Seasonal Harvest</h2>
                <p className="text-neutral-500 text-sm italic">Precisely picked for nutritional balance</p>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name as Category)}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      selectedCategory === cat.name 
                      ? 'bg-brand-800 text-white border-brand-800 shadow-md' 
                      : 'bg-white text-neutral-500 border-neutral-100 hover:border-brand-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredVeggies.map((veg) => (
                <VeggieCard 
                  key={veg.id} 
                  vegetable={veg} 
                  onAddToCart={handleAddToCart} 
                />
              ))}
            </div>
            
            {filteredVeggies.length === 0 && (
              <div className="py-20 text-center bg-white/50 rounded-3xl border border-dashed border-neutral-200">
                <p className="text-neutral-400 italic">No produce matches your selection.</p>
              </div>
            )}
          </section>

          {/* AI Recipe Section */}
          <section className="mb-12">
            <SmartRecipe ingredients={cart} />
          </section>
        </div>

        <footer className="bg-white border-t border-neutral-100 pt-12 pb-8 px-8 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-800 rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-black tracking-tighter text-neutral-900 uppercase mb-0">Sabji<span className="text-brand-600">Wala</span></span>
              </div>
              <p className="text-neutral-500 text-sm max-w-sm mb-6 leading-relaxed">
                Precision-sourced organic produce delivered with geometric balance. Sustainable farming meets modern kitchen needs.
              </p>
              <div className="flex gap-3">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="p-2 bg-neutral-50 rounded-lg hover:bg-brand-100 text-neutral-400 hover:text-brand-700 transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4">Product</h4>
              <ul className="space-y-3 text-xs text-neutral-500">
                <li><a href="#" className="hover:text-brand-700">Marketplace</a></li>
                <li><a href="#" className="hover:text-brand-700">Harvest Box</a></li>
                <li><a href="#" className="hover:text-brand-700">Wholesale</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4">Account</h4>
              <ul className="space-y-3 text-xs text-neutral-500">
                <li><a href="#" className="hover:text-brand-700">My Harvest</a></li>
                <li><a href="#" className="hover:text-brand-700">Farm Wallet</a></li>
                <li><a href="#" className="hover:text-brand-700">Preferences</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4">Admin</h4>
              <ul className="space-y-3 text-xs text-neutral-500">
                {isAdmin ? (
                  <li>
                    <button 
                      onClick={() => setView('admin')}
                      className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800"
                    >
                      <LayoutDashboard className="w-3 h-3" />
                      Admin Dashboard
                    </button>
                  </li>
                ) : (
                  <li>
                    <button 
                      onClick={handleAdminLogin}
                      className="hover:text-brand-700"
                    >
                      Staff Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-50 text-center text-neutral-400 text-[10px]">
            &copy; 2026 SABJI WALA Delivery Systems. All Rights Reserved.
          </div>
        </footer>
      </main>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={totalAmount}
        cart={cart}
        onSuccess={() => {
          setCart([]);
          setIsCheckoutOpen(false);
        }}
      />
    </div>
  );
}

