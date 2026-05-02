import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Smartphone, Banknote, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cart: CartItem[];
  onSuccess: () => void;
}

type Step = 'shipping' | 'details' | 'processing' | 'success';
type PaymentMethod = 'upi' | 'card' | 'cod';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, total, cart, onSuccess }) => {
  const [step, setStep] = useState<Step>('shipping');
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: ''
  });

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('details');
  };

  const handlePayment = async () => {
    setStep('processing');
    
    try {
      // Save order to Firestore
      await addDoc(collection(db, 'orders'), {
        customer: formData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit
        })),
        total,
        status: 'pending',
        paymentMethod: method,
        createdAt: serverTimestamp()
      });

      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep('shipping'); // Reset for next time
      }, 3000);
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Something went wrong while placing your order. Please try again.");
      setStep('details');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[200]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] shadow-2xl z-[201] overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-black uppercase tracking-tight text-neutral-900">
                  {step === 'shipping' ? 'Delivery Details' : step === 'details' ? 'Secure Payment' : 'Order Status'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-neutral-400" />
                </button>
              </div>

              {step === 'shipping' && (
                <form onSubmit={handleNextToPayment} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Mobile Number</label>
                    <input 
                      required
                      type="tel" 
                      pattern="[0-9]{10}"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                      placeholder="10 digit mobile number"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Full Address</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
                      placeholder="House No, Street, Landmark..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Pincode</label>
                    <input 
                      required
                      type="text" 
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                      placeholder="6 digit pincode"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 active:scale-95"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {step === 'details' && (
                <div>
                  <div className="bg-brand-50 rounded-2xl p-6 mb-8 border border-brand-100">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-neutral-500">Order Amount</span>
                      <span className="font-bold text-neutral-900">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-display font-black text-brand-800">
                      <span>To Pay</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Select Payment Method</p>
                    
                    <button 
                      onClick={() => setMethod('upi')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        method === 'upi' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/10' : 'border-neutral-100 bg-white hover:border-brand-200'
                      }`}
                    >
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-neutral-100 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-neutral-900" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-neutral-900 leading-none mb-1">UPI Payments</p>
                        <p className="text-[10px] text-neutral-400 font-medium">GPay, PhonePe, Paytm</p>
                      </div>
                      {method === 'upi' && <div className="ml-auto w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>}
                    </button>

                    <button 
                      onClick={() => setMethod('card')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        method === 'card' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/10' : 'border-neutral-100 bg-white hover:border-brand-200'
                      }`}
                    >
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-neutral-100 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-neutral-900" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-neutral-900 leading-none mb-1">Credit / Debit Card</p>
                        <p className="text-[10px] text-neutral-400 font-medium">Visa, Mastercard, Rupay</p>
                      </div>
                      {method === 'card' && <div className="ml-auto w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>}
                    </button>

                    <button 
                      onClick={() => setMethod('cod')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        method === 'cod' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/10' : 'border-neutral-100 bg-white hover:border-brand-200'
                      }`}
                    >
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-neutral-100 flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-neutral-900" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-neutral-900 leading-none mb-1">Cash on Delivery</p>
                        <p className="text-[10px] text-neutral-400 font-medium">Pay when you receive veggies</p>
                      </div>
                      {method === 'cod' && <div className="ml-auto w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    PCI-DSS SECURE TRANSACTION
                  </div>

                  <button 
                    onClick={handlePayment}
                    className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 active:scale-95"
                  >
                    Pay ₹{total.toFixed(0)} Now
                  </button>
                </div>
              )}

              {step === 'processing' && (
                <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-6" />
                  <h3 className="text-2xl font-display font-black text-neutral-900 uppercase mb-2">Processing</h3>
                  <p className="text-neutral-500 text-sm">Communicating with your bank... <br/>Please do not refresh or close.</p>
                </div>
              )}

              {step === 'success' && (
                <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-black text-neutral-900 uppercase mb-2">Order Confirmed!</h3>
                  <p className="text-neutral-500 text-sm">Aapka fresh sabji raste mein hai. <br/>Thank you for shopping at Sabji Wala!</p>
                  <p className="text-[10px] text-neutral-400 mt-4 italic font-bold">Delivery to: {formData.address}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
