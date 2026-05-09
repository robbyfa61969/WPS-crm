import { useState } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Droplet, ShieldCheck, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';

export function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
      {/* Decorative elements to match the "Specialist" theme */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#005bb7]/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#005bb7]/10 rounded-full blur-[100px] -ml-32 -mb-32" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <Logo size="xl" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black tracking-tighter text-[#005bb7] mb-2 uppercase italic"
          >
            Waterpump Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]"
          >
            Professional Field CRM
          </motion.p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tech@aquaflow.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => signIn(email || 'manager@aquaflow.com', UserRole.MANAGER)}
                className="flex flex-col items-center gap-3 p-4 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all group"
              >
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <ShieldCheck size={20} className="text-slate-600 group-hover:text-blue-600" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-900">Manager</span>
              </button>
              
              <button
                onClick={() => signIn(email || 'tech@aquaflow.com', UserRole.TECHNICIAN)}
                className="flex flex-col items-center gap-3 p-4 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all group"
              >
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Wrench size={20} className="text-slate-600 group-hover:text-blue-600" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-900">Technician</span>
              </button>
            </div>
            
            <p className="text-[10px] text-center text-slate-400 font-medium">
              By signing in, you agree to our terms of service and internal guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
