import { MoveLeft, LogOut, Menu, X, Plus, Calendar, Users, ClipboardList, Camera, Package } from 'lucide-react';
import { useState } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Logo } from './Logo';

export function Sidebar() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: user?.role === UserRole.MANAGER ? 'Dashboard' : 'My Schedule', path: '/', icon: Calendar },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Inventory', path: '/inventory', icon: Package },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        id="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-8">
          <div className="mb-12">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <div className="flex flex-col">
                <h1 className="text-xs font-black text-[#005bb7] leading-tight tracking-tight uppercase">
                  Waterpump<br />Services cc
                </h1>
                <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">Established 1980</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                  location.pathname === item.path 
                    ? "bg-[#eef5ff] text-[#005bb7]" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-colors",
                  location.pathname === item.path ? "text-[#005bb7]" : "text-slate-400 group-hover:text-slate-600"
                )} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-[#eee]">
            <div className="flex items-center gap-3 px-3 mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                {user?.name?.[0].toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-[10px] uppercase text-slate-400 font-bold">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
