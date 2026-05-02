import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Truck,
  LogOut,
  ArrowLeft,
  Trash2,
  Edit2,
  X,
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  addDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Order, Vegetable } from '../types';
import { VEGETABLES } from '../data/veggies';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [veggies, setVeggies] = useState<Vegetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Vegetable | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Leafy',
    price: 0,
    unit: 'kg',
    stock: 0,
    image: '',
    description: '',
    benefits: ''
  });

  useEffect(() => {
    // Orders Listener
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    }, (error) => {
      import('../lib/firestoreErrors').then(({ handleFirestoreError, OperationType }) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
      });
    });

    // Veggies Listener
    const qVeggies = query(collection(db, 'vegetables'), orderBy('name', 'asc'));
    const unsubscribeVeggies = onSnapshot(qVeggies, (snapshot) => {
      const veggiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vegetable[];
      setVeggies(veggiesData);
      setLoading(false);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeVeggies();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        unit: productForm.unit,
        stock: Number(productForm.stock),
        image: productForm.image,
        description: productForm.description,
        benefits: productForm.benefits.split(',').map(b => b.trim()).filter(b => b)
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'vegetables', editingProduct.id), data);
        alert("Product updated successfully!");
      } else {
        await addDoc(collection(db, 'vegetables'), data);
        alert("Product added successfully!");
      }
      setIsAddingProduct(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: 'Leafy', price: 0, unit: 'kg', stock: 0, image: '', description: '', benefits: '' });
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'vegetables', id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const syncDefaultProducts = async () => {
    if (!confirm("This will upload all default vegetables to your database. Continue?")) return;
    try {
      const batch = writeBatch(db);
      VEGETABLES.forEach((veg) => {
        const newDocRef = doc(collection(db, 'vegetables'));
        const { id, ...vegData } = veg; // Remove static ID
        batch.set(newDocRef, vegData);
      });
      await batch.commit();
      alert("Successfully synced default products!");
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col p-6 fixed inset-y-0 z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-brand-700 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-display font-black tracking-tighter text-brand-800 uppercase">Sabji<span className="text-brand-600">Admin</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'inventory' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            <Package className="w-5 h-5" />
            Inventory
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 transition-all">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 transition-all">
            <Users className="w-5 h-5" />
            Customers
          </button>
        </nav>

        <div className="mt-auto space-y-2">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </button>
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-black text-neutral-900 uppercase">
              {activeTab === 'orders' ? 'Order Management' : 'Inventory Management'}
            </h1>
            <p className="text-neutral-500 text-sm">Dashboard / {activeTab === 'orders' ? 'Orders' : 'Inventory'}</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white border border-neutral-200 rounded-full px-10 py-2.5 text-sm w-64 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
            {activeTab === 'inventory' && (
              <>
                <button 
                  onClick={syncDefaultProducts}
                  className="bg-white text-neutral-600 px-6 py-2.5 rounded-full font-bold text-sm border border-neutral-200 hover:bg-neutral-50 transition-all flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" /> Sync Default
                </button>
                <button 
                  onClick={() => setIsAddingProduct(true)}
                  className="bg-brand-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </>
            )}
          </div>
        </header>

        {auth.currentUser?.email === 'pariya9547@gmail.com' && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
            <p className="text-xs text-blue-700">
              <span className="font-bold">Owner Access:</span> You are accessing this via email verification. Would you like to register your account in the permanent admin list?
            </p>
            <button 
              onClick={async () => {
                const { setDoc, doc } = await import('firebase/firestore');
                await setDoc(doc(db, 'admins', auth.currentUser!.uid), {
                  email: auth.currentUser!.email,
                  role: 'owner'
                }, { merge: true });
                alert("Registered as permanent admin!");
              }}
              className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700"
            >
              Verify Now
            </button>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200">
                <p className="text-neutral-500 animate-pulse font-bold tracking-widest uppercase text-xs">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800">No orders yet</h3>
                <p className="text-neutral-500 text-sm">When customers shop, their orders will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Order Details</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Customer</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-neutral-900 text-sm">#{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Just now'}
                          </p>
                          <p className="text-[10px] bg-brand-50 text-brand-700 inline-block px-1.5 py-0.5 rounded mt-2 font-bold">
                            {order.items.length} items
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-neutral-900 text-sm">{order.customer.name}</p>
                          <p className="text-xs text-neutral-500">{order.customer.mobile}</p>
                          <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1 max-w-[200px]">{order.customer.address}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-display font-black text-neutral-900">₹{order.total.toFixed(2)}</p>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-1">{order.paymentMethod}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                              >
                                <Truck className="w-4 h-4" />
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {veggies.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200">
                <Package className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-800">Inventory Empty</h3>
                <p className="text-neutral-500 text-sm mb-6">Start adding products or sync with default data.</p>
                <button 
                  onClick={syncDefaultProducts}
                  className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-600/20"
                >
                  Sync Default Data
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {veggies.map((veg) => (
                  <div key={veg.id} className="bg-white rounded-3xl p-6 border border-neutral-200 flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-100">
                      <img src={veg.image} alt={veg.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-neutral-900 uppercase tracking-tight">{veg.name}</h4>
                        <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded">
                          {veg.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-medium mb-3">{veg.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Price</p>
                            <p className="font-display font-black text-neutral-900">₹{veg.price}/{veg.unit}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Stock</p>
                            <p className={`font-bold ${veg.stock < 10 ? 'text-red-500' : 'text-neutral-900'}`}>{veg.stock} {veg.unit}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingProduct(veg);
                              setProductForm({
                                ...veg,
                                benefits: veg.benefits.join(', ')
                              });
                            }}
                            className="p-2 bg-neutral-50 text-neutral-500 rounded-lg hover:bg-neutral-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(veg.id)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Overlay */}
        <AnimatePresence>
          {(isAddingProduct || editingProduct) && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                <div className="p-10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-display font-black uppercase text-neutral-900">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button 
                      onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-neutral-400" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Product Name</label>
                        <input 
                          required
                          type="text" 
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Category</label>
                        <select 
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all appearance-none"
                        >
                          <option value="Leafy">Leafy</option>
                          <option value="Root">Root</option>
                          <option value="Cruciferous">Cruciferous</option>
                          <option value="Marrow">Marrow</option>
                          <option value="Allium">Allium</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Price (₹)</label>
                        <input 
                          required
                          type="number" 
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                          className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Unit</label>
                        <input 
                          required
                          type="text" 
                          value={productForm.unit}
                          onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                          className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                          placeholder="kg, bunch, pkt..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Stock</label>
                        <input 
                          required
                          type="number" 
                          value={productForm.stock}
                          onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                          className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Image URL</label>
                      <input 
                        required
                        type="url" 
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        required
                        rows={2}
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Benefits (Comma separated)</label>
                      <input 
                        type="text" 
                        value={productForm.benefits}
                        onChange={(e) => setProductForm({...productForm, benefits: e.target.value})}
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        placeholder="Vitamin C, High Fiber..."
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
