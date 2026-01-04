
import React from 'react';
import { GlobalEvent, ConvertedTime } from '../types';
import { convertEventTime, formatToICS } from '../services/timeService';
import { Calendar, Trash2, ExternalLink, Clock } from 'lucide-react';

interface EventCardProps {
  event: GlobalEvent;
  userTz: string;
  onDelete: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, userTz, onDelete }) => {
  const conversion = convertEventTime(event.sourceDate, event.sourceTime, event.sourceTimezone, userTz);

  const handleDownloadICS = () => {
    const icsContent = formatToICS(event.name, event.sourceDate, event.sourceTime, event.sourceTimezone);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.name || 'event'}.ics`;
    link.click();
  };

  return (
    <div className="glass p-5 rounded-2xl group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-white/5">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-600" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold font-orbitron text-white neon-cyan">
            {event.name || 'Untitled Event'}
          </h3>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
            <Clock size={14} /> From: {event.sourceTimezone.split('/').pop()?.replace(/_/g, ' ')}
          </p>
        </div>
        <button 
          onClick={() => onDelete(event.id)}
          className="p-2 rounded-full text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Original Time</p>
          <p className="text-sm font-medium">{event.sourceTime} ({event.sourceDate})</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400">Local Time</p>
          <p className="text-sm font-bold text-cyan-300">{conversion.localTime}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          conversion.dayDiff === 'Next day' ? 'bg-purple-500/20 text-purple-400' : 
          conversion.dayDiff === 'Previous day' ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'
        }`}>
          {conversion.dayDiff}
        </span>
        
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadICS}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-2 text-xs"
          >
            <Calendar size={14} /> Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
