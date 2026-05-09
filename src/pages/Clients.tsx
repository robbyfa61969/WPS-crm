import { useState } from 'react';
import { Client } from '../types';
import { Users, Phone, MapPin, Search, Plus, MoreVertical, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Grand Plaza Hotel', address: '123 Luxury Ave, Downtown', phone: '+1-555-0101', notes: 'Main borehole pump needs monthly check.' },
  { id: 'c2', name: 'City Industrial Park', address: '45 Factory Road, East Side', phone: '+1-555-0102', notes: 'High pressure distribution system.' },
  { id: 'c3', name: 'Skyline Apartments', address: '88 View Terrace, North Hill', phone: '+1-555-0103', notes: 'Booster system specialist needed.' },
];

export function Clients() {
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:bg-slate-50 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
        </button>
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clients</h1>
          <p className="text-slate-500 mt-1">Manage water systems customer database</p>
        </div>
        
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          <Plus size={18} />
          Add Client
        </button>
      </header>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Client Info</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                        {client.name[0]}
                      </div>
                      <span className="font-bold text-slate-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium whitespace-nowrap">
                      <MapPin size={14} className="text-slate-400" />
                      {client.address}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium whitespace-nowrap">
                      <Phone size={14} className="text-slate-400" />
                      {client.phone}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 group-hover:bg-white rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
