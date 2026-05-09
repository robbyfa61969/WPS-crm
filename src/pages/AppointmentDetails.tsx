import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Appointment, AppointmentStatus } from '../types';
import { 
  ArrowLeft, Calendar, Clock, MapPin, 
  CheckCircle2, Camera, User, Clipboard, 
  FileText, Image as ImageIcon, X, Plus, Trash2, Box,
  Package, Search, AlertTriangle, Check, XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useInventory } from '../contexts/InventoryContext';
import { MaterialUsage } from '../types';
import { ShieldCheck } from 'lucide-react';

export function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { inventory, logUsage } = useInventory();
  
  // State for adding materials
  const [usedMaterials, setUsedMaterials] = useState<MaterialUsage[]>([]);
  const [showMaterialSearch, setShowMaterialSearch] = useState(false);
  const [materialSearch, setMaterialSearch] = useState('');
  
  // Filter available inventory for search
  const availableInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(materialSearch.toLowerCase()) &&
    !usedMaterials.some(um => um.itemId === i.id)
  );

  const addMaterial = (item: any) => {
    setUsedMaterials([...usedMaterials, { itemId: item.id, itemName: item.name, quantity: 1 }]);
    setShowMaterialSearch(false);
    setMaterialSearch('');
  };

  const removeMaterial = (itemId: string) => {
    setUsedMaterials(usedMaterials.filter(m => m.itemId !== itemId));
  };

  const updateMaterialQty = (itemId: string, qty: number) => {
    setUsedMaterials(usedMaterials.map(m => m.itemId === itemId ? { ...m, quantity: Math.max(1, qty) } : m));
  };

  const [appointment, setAppointment] = useState<Appointment>({
    id: id || '1',
    clientId: 'c1',
    clientName: 'Grand Plaza Hotel',
    technicianId: 't1',
    technicianName: 'Mike Ross',
    scheduledAt: new Date().toISOString(),
    status: AppointmentStatus.SCHEDULED,
    description: 'Borehole pump inspection and pressure check. Staff reported unusual vibration in the pump room.',
    photoUrls: [],
    materialsUsed: [],
    updatedAt: new Date().toISOString()
  });

  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  
  const MIN_PHOTOS_REQUIRED = 3;

  const handleUpdateStatus = async (newStatus: AppointmentStatus) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600)); // Simulating API
    setAppointment({ ...appointment, status: newStatus, updatedAt: new Date().toISOString() });
    setIsSubmitting(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos([...photos, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmitReport = async () => {
    if (photos.length < MIN_PHOTOS_REQUIRED) {
      alert(`Minimum ${MIN_PHOTOS_REQUIRED} site photos required to finalize report.`);
      return;
    }

    setIsSubmitting(true);
    
    // Log usage to inventory context
    if (usedMaterials.length > 0) {
      logUsage(appointment.id, usedMaterials, user?.name || 'Technician');
    }

    await new Promise(r => setTimeout(r, 1000));
    setAppointment({
      ...appointment,
      status: AppointmentStatus.AWAITING_APPROVAL,
      report: notes,
      photoUrls: photos,
      materialsUsed: usedMaterials,
      updatedAt: new Date().toISOString()
    });
    setIsSubmitting(false);
  };

  const handleManagerDecision = async (approve: boolean) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    setAppointment({
      ...appointment,
      status: approve ? AppointmentStatus.COMPLETED : AppointmentStatus.IN_PROGRESS,
      rejectionReason: approve ? undefined : rejectionNote,
      updatedAt: new Date().toISOString()
    });
    
    if (!approve) setRejectionNote('');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-2 lg:px-0">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-slate-50 transition-all">
            <ArrowLeft size={20} />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider hidden sm:inline">Back to Schedule</span>
        </button>

        {user?.role === UserRole.TECHNICIAN && appointment.status === AppointmentStatus.SCHEDULED && (
          <button 
            onClick={() => handleUpdateStatus(AppointmentStatus.IN_PROGRESS)}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#005bb7] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200/50 hover:bg-[#00448a] transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Clock size={16} />}
            Initialize Work
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#005bb7]/5 rounded-bl-[100px] -mr-8 -mt-8" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
              <div>
                <span className={cn(
                  "inline-block text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest mb-4",
                  appointment.status === AppointmentStatus.SCHEDULED ? "bg-amber-100 text-amber-700" :
                  appointment.status === AppointmentStatus.IN_PROGRESS ? "bg-blue-100 text-[#005bb7]" :
                  appointment.status === AppointmentStatus.AWAITING_APPROVAL ? "bg-purple-100 text-purple-700 font-black animate-pulse" :
                  "bg-green-100 text-green-700"
                )}>
                  {appointment.status.replace('-', ' ')}
                </span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">{appointment.clientName}</h2>
              </div>
              
              <div className="text-left md:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Service Order Number</p>
                <p className="text-2xl font-mono font-black text-[#005bb7]">#WPS-{appointment.id.padStart(4, '0')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-y border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                </div>
                <p className="font-bold text-slate-900">{format(new Date(appointment.scheduledAt), 'PPP')}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                </div>
                <p className="font-bold text-slate-900">{format(new Date(appointment.scheduledAt), 'p')}</p>
              </div>
              <div className="space-y-1 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <User size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Technician</span>
                </div>
                <p className="font-bold text-slate-900">{appointment.technicianName}</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <Clipboard size={14} /> Description
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                {appointment.description}
              </p>
            </div>
          </section>

          {/* Technician Action Area */}
          {(user?.role === UserRole.TECHNICIAN || appointment.status === AppointmentStatus.COMPLETED) && (
            <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="text-blue-600" />
                  Service Report
                </h3>
                
                {appointment.status !== AppointmentStatus.COMPLETED ? (
                  <div className="space-y-8">
                    {appointment.rejectionReason && (
                      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                        <AlertTriangle className="text-red-500 mt-0.5" size={20} />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Job Rejected by Manager</p>
                          <p className="text-xs font-bold text-slate-700 mt-1">{appointment.rejectionReason}</p>
                        </div>
                      </div>
                    )}

                    {/* Notes Section */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Field Notes & Observations</label>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Detail the technical work performed..."
                        className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#005bb7]/10 focus:border-[#005bb7] outline-none transition-all placeholder:text-slate-300 font-medium"
                      />
                    </div>

                    {/* Materials Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Materials & Parts Used</label>
                        <button 
                          onClick={() => setShowMaterialSearch(true)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#005bb7] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                        >
                          <Plus size={14} />
                          Add Material
                        </button>
                      </div>

                      {showMaterialSearch && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                          <div className="relative">
                            <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <input 
                              autoFocus
                              type="text"
                              placeholder="Search inventory..."
                              value={materialSearch}
                              onChange={(e) => setMaterialSearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm"
                            />
                          </div>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {availableInventory.map(item => (
                              <button 
                                key={item.id}
                                onClick={() => addMaterial(item)}
                                className="w-full text-left px-3 py-2 hover:bg-white rounded-lg text-xs font-bold text-slate-600 transition-colors flex items-center justify-between"
                              >
                                {item.name}
                                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{item.category} • {item.stockQuantity} in stock</span>
                              </button>
                            ))}
                            {availableInventory.length === 0 && (
                              <div className="px-3 py-4 text-center text-[10px] text-slate-400 uppercase font-black tracking-widest">No matching items</div>
                            )}
                          </div>
                          <button onClick={() => setShowMaterialSearch(false)} className="w-full py-1 text-[8px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">Cancel Search</button>
                        </div>
                      )}

                      <div className="space-y-2">
                        {usedMaterials.map(m => (
                          <div key={m.itemId} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#005bb7] flex items-center justify-center">
                              <Package size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-black uppercase tracking-tight text-slate-900 leading-none mb-1">{m.itemName}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Part ID: {m.itemId}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                min="1"
                                className="w-12 py-1 text-center bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none"
                                value={m.quantity}
                                onChange={(e) => updateMaterialQty(m.itemId, parseInt(e.target.value))}
                              />
                              <button 
                                onClick={() => removeMaterial(m.itemId)}
                                className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {usedMaterials.length === 0 && !showMaterialSearch && (
                          <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                            <Box className="mx-auto text-slate-200 mb-2" size={32} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No materials recorded</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Site Photos</label>
                          <p className={cn(
                            "text-[8px] font-bold uppercase tracking-widest mt-1",
                            photos.length < MIN_PHOTOS_REQUIRED ? "text-red-500" : "text-green-600"
                          )}>
                            {photos.length} of {MIN_PHOTOS_REQUIRED} Required Photos Added
                          </p>
                        </div>
                        <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#005bb7] rounded-xl text-[10px] font-black cursor-pointer hover:bg-blue-100 transition-colors uppercase tracking-widest">
                          <Camera size={14} />
                          Add Photo
                          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        </label>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {photos.map((src, i) => (
                          <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-md">
                            <img src={src} className="w-full h-full object-cover" alt={`Site ${i}`} />
                            <button 
                              onClick={() => removePhoto(i)}
                              className="absolute top-2 right-2 p-1.5 bg-white shadow-xl text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {photos.length === 0 && (
                          <div className="aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleSubmitReport}
                      disabled={isSubmitting || !notes || photos.length < MIN_PHOTOS_REQUIRED}
                      className="w-full py-4 bg-[#005bb7] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-200/50 hover:bg-[#00448a] disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          {photos.length < MIN_PHOTOS_REQUIRED ? 'Photos Required' : 'Submit Final Field Report'}
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-green-50/50 rounded-2xl border border-green-100">
                      <p className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                        {appointment.report || 'No notes provided.'}
                      </p>
                    </div>

                    {appointment.materialsUsed && appointment.materialsUsed.length > 0 && (
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Materials & Parts Invoiced</h5>
                        <div className="space-y-2">
                          {appointment.materialsUsed.map((m) => (
                            <div key={m.itemId} className="flex items-center justify-between py-2 border-b border-white last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#005bb7] shadow-sm">
                                  <Package size={14} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{m.itemName}</span>
                              </div>
                              <span className="text-xs font-black italic text-[#005bb7]">x{m.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {appointment.photoUrls && appointment.photoUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {appointment.photoUrls.map((url, i) => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                            <img src={url} className="w-full h-full object-cover" alt={`Service report ${i}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

          <div className="space-y-6">
            {user?.role === UserRole.MANAGER && (
              <div className="space-y-6">
                {appointment.status === AppointmentStatus.AWAITING_APPROVAL && (
                  <section className="bg-white p-8 rounded-[40px] border-[#005bb7] border-2 shadow-2xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#005bb7]/10 text-[#005bb7] rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Director Review</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify Job Standards & Materials</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => handleManagerDecision(true)}
                        className="w-full py-4 bg-[#005bb7] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-100 hover:bg-[#00448a] transition-all"
                      >
                        <Check size={18} />
                        Approve & Finalize Job
                      </button>
                      
                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Rejection Feedback (Optional)</label>
                        <textarea 
                          value={rejectionNote}
                          onChange={(e) => setRejectionNote(e.target.value)}
                          placeholder="Explain what needs to be fixed..."
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 mb-2"
                        />
                        <button 
                          onClick={() => handleManagerDecision(false)}
                          disabled={!rejectionNote}
                          className="w-full py-3 bg-white text-red-600 border border-red-100 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-red-50 transition-all disabled:opacity-30"
                        >
                          <XCircle size={16} />
                          Reject Technical Report
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {appointment.status !== AppointmentStatus.COMPLETED && appointment.status !== AppointmentStatus.AWAITING_APPROVAL && (
                  <section className="bg-slate-900 p-6 rounded-[32px] text-white space-y-4 shadow-xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Logistics & HQ Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full py-2.5 bg-slate-800 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-slate-700 transition-colors">Reschedule Job</button>
                      <button className="w-full py-2.5 bg-slate-800 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-slate-700 transition-colors">Route Optimization</button>
                      <button className="w-full py-2.5 bg-red-900/30 text-red-400 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-red-900/50 transition-colors">Void Order</button>
                    </div>
                  </section>
                )}
              </div>
            )}

            <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Timeline</h4>
            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
                <p className="text-xs font-bold text-slate-900">Appointment Scheduled</p>
                <p className="text-[10px] text-slate-400 font-medium">May 10, 2026 • 10:30 AM</p>
              </div>
              
              {appointment.status === AppointmentStatus.COMPLETED && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-green-50 border-4 border-white shadow-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <p className="text-xs font-bold text-slate-900">Work Completed</p>
                  <p className="text-[10px] text-slate-400 font-medium">{format(new Date(appointment.updatedAt), 'PPp')}</p>
                </div>
              )}
            </div>
          </section>

          {user?.role === UserRole.MANAGER && appointment.status !== AppointmentStatus.COMPLETED && (
             <section className="bg-slate-900 p-6 rounded-[32px] text-white space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Actions</h4>
                <div className="space-y-2">
                  <button className="w-full py-2.5 bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">Reschedule Job</button>
                  <button className="w-full py-2.5 bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">Assign Different Tech</button>
                  <button className="w-full py-2.5 bg-red-900/30 text-red-400 rounded-xl text-xs font-bold hover:bg-red-900/50 transition-colors">Cancel Appointment</button>
                </div>
             </section>
          )}
        </div>
      </div>
    </div>
  );
}
