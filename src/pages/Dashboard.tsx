import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Appointment, AppointmentStatus, Client } from '../types';
import { Calendar as CalendarIcon, Clock, MapPin, User as UserIcon, ChevronRight, Plus, Wrench, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

// Mock data
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    clientId: 'c1',
    clientName: 'Grand Plaza Hotel',
    technicianId: 't1',
    technicianName: 'Mike Ross',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    status: AppointmentStatus.SCHEDULED,
    description: 'Borehole pump inspection and pressure check.',
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    clientId: 'c2',
    clientName: 'City Industrial Park',
    technicianId: 't2',
    technicianName: 'Sarah Jenkins',
    scheduledAt: new Date(Date.now() - 3600000).toISOString(),
    status: AppointmentStatus.IN_PROGRESS,
    description: 'Emergency replacement of main distribution valve.',
    updatedAt: new Date().toISOString()
  }
];

const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Grand Plaza Hotel', address: '123 Luxury Ave', phone: '555-0101' },
  { id: 'c2', name: 'City Industrial Park', address: '45 Factory Road', phone: '555-0102' },
  { id: 'c3', name: 'Skyline Apartments', address: '88 View Terrace', phone: '555-0103' },
];

export function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Appointment Form State
  const [newApp, setNewApp] = useState({
    clientId: '',
    description: '',
    scheduledAt: '',
    technicianId: 't1' // Defaulting for mock
  });

  const filteredAppointments = user?.role === UserRole.TECHNICIAN 
    ? appointments.filter(a => a.technicianId === 't1') 
    : appointments;

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const client = MOCK_CLIENTS.find(c => c.id === newApp.clientId);
    const appointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: newApp.clientId,
      clientName: client?.name || 'Unknown Client',
      technicianId: newApp.technicianId,
      technicianName: newApp.technicianId === 't1' ? 'Mike Ross' : 'Sarah Jenkins',
      scheduledAt: newApp.scheduledAt || new Date().toISOString(),
      status: AppointmentStatus.SCHEDULED,
      description: newApp.description,
      updatedAt: new Date().toISOString()
    };
    setAppointments([appointment, ...appointments]);
    setIsModalOpen(false);
    setNewApp({ clientId: '', description: '', scheduledAt: '', technicianId: 't1' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 italic uppercase">
            {user?.role === UserRole.MANAGER ? 'Management' : 'Technical'} Hub
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            {user?.role === UserRole.MANAGER 
              ? `Monitoring ${appointments.length} active work orders` 
              : `Technician: ${user?.name} | ${filteredAppointments.length} assigned jobs`}
          </p>
        </div>
        
        {user?.role === UserRole.MANAGER && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#005bb7] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200/50 hover:bg-[#00448a] transition-all active:scale-95"
          >
            <Plus size={18} />
            Schedule Job
          </button>
        )}
      </header>

      <div className="grid gap-6">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
              <CalendarIcon size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No appointments found</h3>
            <p className="text-slate-500 max-w-xs">There are no service requests assigned at this moment.</p>
          </div>
        ) : (
          filteredAppointments.map((app) => (
            <Link 
              key={app.id} 
              to={`/appointments/${app.id}`}
              className="group"
            >
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all flex flex-col md:flex-row md:items-center gap-6">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border shadow-inner",
                  app.status === AppointmentStatus.SCHEDULED ? "bg-amber-50 text-amber-600 border-amber-100" :
                  app.status === AppointmentStatus.IN_PROGRESS ? "bg-blue-50 text-[#005bb7] border-blue-100" :
                  app.status === AppointmentStatus.AWAITING_APPROVAL ? "bg-purple-50 text-purple-600 border-purple-100" :
                  "bg-green-50 text-green-600 border-green-100"
                )}>
                  <span className="text-[10px] font-black uppercase tracking-tighter">{format(new Date(app.scheduledAt), 'MMM')}</span>
                  <span className="text-2xl font-black font-mono">{format(new Date(app.scheduledAt), 'dd')}</span>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#005bb7] transition-colors leading-none tracking-tight italic uppercase">
                      {app.clientName}
                    </h3>
                    <span className={cn(
                      "text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-[0.1em]",
                      app.status === AppointmentStatus.SCHEDULED ? "bg-amber-100 text-amber-700" :
                      app.status === AppointmentStatus.IN_PROGRESS ? "bg-blue-100 text-[#005bb7]" :
                      app.status === AppointmentStatus.AWAITING_APPROVAL ? "bg-purple-100 text-purple-700 animate-pulse" :
                      "bg-green-100 text-green-700"
                    )}>
                      {app.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-300" />
                      {format(new Date(app.scheduledAt), 'p')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wrench size={14} className="text-slate-300" />
                      {app.technicianName}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 font-medium line-clamp-1">{app.description}</p>
                </div>

                <div className="hidden md:block">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Creation Modal */}
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
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Schedule Job</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">New Service Request</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white rounded-full shadow-sm transition-colors text-slate-400 border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1">Client Record</label>
                  <select 
                    required
                    value={newApp.clientId}
                    onChange={(e) => setNewApp({...newApp, clientId: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#005bb7]/10 focus:border-[#005bb7] font-medium transition-all"
                  >
                    <option value="">Select client...</option>
                    {MOCK_CLIENTS.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1">Service Time</label>
                    <input 
                      required
                      type="datetime-local"
                      value={newApp.scheduledAt}
                      onChange={(e) => setNewApp({...newApp, scheduledAt: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#005bb7]/10 focus:border-[#005bb7] font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1">Technician</label>
                    <select 
                      required
                      value={newApp.technicianId}
                      onChange={(e) => setNewApp({...newApp, technicianId: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#005bb7]/10 focus:border-[#005bb7] font-medium transition-all"
                    >
                      <option value="t1">Mike Ross</option>
                      <option value="t2">Sarah Jenkins</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 ml-1">Technical Fault Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={newApp.description}
                    onChange={(e) => setNewApp({...newApp, description: e.target.value})}
                    placeholder="Pump model, pressure issues, leakage details..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#005bb7]/10 focus:border-[#005bb7] font-medium transition-all min-h-[100px]"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-[#005bb7] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:bg-[#00448a] transition-all active:scale-[0.98]"
                >
                  <Check size={18} />
                  Authorize Work Order
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
