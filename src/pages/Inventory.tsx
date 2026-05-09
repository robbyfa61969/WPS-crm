import React, { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { Package, Plus, RotateCcw, TrendingUp, Search, Filter, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Inventory() {
  const { inventory, history, addAdjustment } = useInventory();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stock' | 'history'>('stock');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'restock' | 'return'>('restock');
  
  const [newItem, setNewItem] = useState({
    itemId: '',
    quantity: 0,
    notes: ''
  });

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === newItem.itemId);
    if (!item) return;

    addAdjustment({
      itemId: item.id,
      itemName: item.name,
      type: modalType,
      quantity: newItem.quantity,
      technicianName: user?.name,
      notes: newItem.notes
    });

    setIsModalOpen(false);
    setNewItem({ itemId: '', quantity: 0, notes: '' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 italic uppercase">Warehouse Inventory</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Materials, Parts & Stock Management</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setModalType('restock'); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-[#005bb7] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200/50 hover:bg-[#00448a] transition-all"
          >
            <Plus size={14} />
            Restock
          </button>
          <button 
            onClick={() => { setModalType('return'); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200/50 hover:bg-black transition-all"
          >
            <RotateCcw size={14} />
            Return Stock
          </button>
        </div>
      </header>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
          <button 
            onClick={() => setActiveTab('stock')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'stock' ? "bg-[#005bb7] text-white shadow-lg shadow-blue-100" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Current Stock
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'history' ? "bg-[#005bb7] text-white shadow-lg shadow-blue-100" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Movement History
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search parts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#005bb7]/10 focus:border-[#005bb7] font-medium shadow-sm"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'stock' ? (
          <motion.div 
            key="stock"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredInventory.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#005bb7] group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-[#eef5ff] text-[#005bb7] px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight mb-1">{item.name}</h3>
                <div className="flex items-end justify-between mt-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Level</p>
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "text-3xl font-black italic",
                        item.stockQuantity < 10 ? "text-red-500" : "text-[#005bb7]"
                      )}>
                        {item.stockQuantity}
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase">{item.unit}s</span>
                    </div>
                  </div>
                  {item.stockQuantity < 10 && (
                    <div className="flex items-center gap-1 text-red-500 animate-pulse">
                      <TrendingUp size={14} className="rotate-180" />
                      <span className="text-[10px] font-black uppercase">Low Stock</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {history.length === 0 ? (
              <div className="bg-white p-12 rounded-[40px] text-center border border-dashed border-slate-200">
                <History className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold uppercase tracking-widest">No stock movement recorded</p>
              </div>
            ) : (
              history.map(adj => (
                <div key={adj.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    adj.type === 'restock' ? "bg-green-50 text-green-600" : 
                    adj.type === 'return' ? "bg-blue-50 text-[#005bb7]" : 
                    "bg-orange-50 text-orange-600"
                  )}>
                    {adj.type === 'restock' ? <ArrowDownLeft size={20} /> : 
                     adj.type === 'return' ? <RotateCcw size={20} /> :
                     <ArrowUpRight size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-900 uppercase italic tracking-tight">{adj.itemName}</h4>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest",
                        adj.type === 'restock' ? "bg-green-100 text-green-700" : 
                        adj.type === 'return' ? "bg-blue-100 text-[#005bb7]" : 
                        "bg-orange-100 text-orange-700"
                      )}>
                        {adj.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{format(new Date(adj.date), 'MMM dd, HH:mm')}</span>
                      <span>By: {adj.technicianName}</span>
                      {adj.appointmentId && <span>Job: #{adj.appointmentId}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-xl font-black italic",
                      adj.type === 'usage' ? "text-orange-600" : "text-green-600"
                    )}>
                      {adj.type === 'usage' ? '-' : '+'}{adj.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adjust Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">
                    {modalType === 'restock' ? 'Restock Item' : 'Return to Stock'}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manual Inventory Update</p>
                </div>
              </div>

              <form onSubmit={handleAdjustment} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1">Select Part/Material</label>
                  <select 
                    required
                    value={newItem.itemId}
                    onChange={(e) => setNewItem({...newItem, itemId: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#005bb7]/10 focus:border-[#005bb7] font-medium"
                  >
                    <option value="">Choose item...</option>
                    {inventory.map(i => (
                      <option key={i.id} value={i.id}>{i.name} ({i.stockQuantity} in stock)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1">Quantity</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#005bb7]/10 focus:border-[#005bb7] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1">Adjustment Notes</label>
                  <textarea 
                    rows={2}
                    value={newItem.notes}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    placeholder="Reason for adjustment..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#005bb7]/10 focus:border-[#005bb7] font-medium"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-[#005bb7] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:bg-[#00448a] transition-all"
                >
                  < TrendingUp size={18} className={modalType === 'return' ? 'rotate-180' : ''} />
                  Authorize Stock Action
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
