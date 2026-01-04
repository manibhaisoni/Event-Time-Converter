
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, MapPin, Calendar, Layers, Clock, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Header } from './components/Header';
import { Globe } from './components/Globe';
import { EventCard } from './components/EventCard';
import { GlobalEvent } from './types';
import { COMMON_TIMEZONES, LOCAL_STORAGE_KEY } from './constants';
import { getCurrentTimezone, convertEventTime } from './services/timeService';

const App: React.FC = () => {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [userTz, setUserTz] = useState(getCurrentTimezone());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    timezone: 'UTC'
  });

  // Load events
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved events", e);
      }
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save events
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: GlobalEvent = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      sourceDate: formData.date,
      sourceTime: formData.time,
      sourceTimezone: formData.timezone,
      createdAt: Date.now()
    };
    setEvents([newEvent, ...events]);
    setFormData({ ...formData, name: '' });
    setIsModalOpen(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const currentLocalTimeStr = useMemo(() => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }, [currentTime]);

  const currentLocalDateStr = useMemo(() => {
    return currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  }, [currentTime]);

  return (
    <div className="min-h-screen bg-[#050505] pb-24 selection:bg-cyan-500/30">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-8 space-y-12">
        {/* Hero / Hero Stats */}
        <section className="relative flex flex-col md:flex-row items-center gap-10 py-4">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> System Online
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-orbitron text-white leading-tight">
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Global Timeline</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
              Synchronize complex events across 24 standard timezones with automated precision and 3D visualization.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform active:scale-95"
              >
                <Plus size={20} /> Create Conversion
              </button>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Globe />
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-3xl flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Detected Location</span>
            <div className="mt-4">
              <h4 className="text-2xl font-bold font-orbitron flex items-center gap-2 text-white">
                <MapPin className="text-purple-500" size={24} /> {userTz.split('/').pop()?.replace(/_/g, ' ')}
              </h4>
              <p className="text-xs text-purple-400 mt-1 font-mono uppercase">Zone ID: {userTz}</p>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl md:col-span-2 flex items-center justify-between group overflow-hidden relative">
            <div className="relative z-10">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Local System Time</span>
              <div className="mt-2 flex items-baseline gap-4">
                <h4 className="text-4xl font-bold font-orbitron text-white neon-cyan">{currentLocalTimeStr}</h4>
                <p className="text-sm text-cyan-500/80 font-medium">{currentLocalDateStr}</p>
              </div>
            </div>
            <Clock className="text-white/5 absolute right-[-20px] bottom-[-20px] w-48 h-48 group-hover:text-cyan-500/10 transition-colors duration-700" />
          </div>
        </div>

        {/* Search & Filter */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="text-cyan-500" size={20} />
              <h3 className="text-xl font-bold font-orbitron text-white">Active Feed</h3>
            </div>
            <div className="flex gap-2">
               <select 
                value={userTz} 
                onChange={(e) => setUserTz(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
               >
                 {COMMON_TIMEZONES.map(tz => (
                   <option key={tz.value} value={tz.value} className="bg-[#111]">{tz.label} ({tz.offset})</option>
                 ))}
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full py-20 glass rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                  <Calendar size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">No active conversions</h4>
                  <p className="text-gray-500 max-w-xs">Start tracking global events by adding your first one today.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                >
                  Get Started
                </button>
              </div>
            ) : (
              events.map(event => (
                <EventCard key={event.id} event={event} userTz={userTz} onDelete={deleteEvent} />
              ))
            )}
          </div>
        </section>
      </main>

      {/* Conversion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="glass w-full max-w-md rounded-3xl p-8 relative z-10 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold font-orbitron text-white">New Conversion</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-gray-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Event Name</label>
                <input 
                  required
                  placeholder="e.g. Tokyo Keynote"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Start Date</label>
                  <input 
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Start Time</label>
                  <input 
                    type="time"
                    required
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Source Timezone</label>
                <select 
                  value={formData.timezone}
                  onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  {COMMON_TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value} className="bg-[#1a1a1a]">{tz.label} ({tz.offset})</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                Launch Tracking <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 md:hidden p-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl z-40 active:scale-90 transition-transform"
      >
        <Plus size={32} />
      </button>

      {/* Bottom info banner */}
      <div className="fixed bottom-0 left-0 right-0 py-2 glass border-t border-white/5 text-center text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium z-50">
        Powered by ManiBhai protocol
      </div>
    </div>
  );
};

export default App;
