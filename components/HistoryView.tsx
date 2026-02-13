
import React, { useState, useEffect } from 'react';
import { ToolType, HistoryEntry } from '../types';

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<ToolType | 'ALL'>('ALL');

  useEffect(() => {
    const saved = localStorage.getItem('nexus_history');
    if (saved) {
      setHistory(JSON.parse(saved).sort((a: any, b: any) => b.timestamp - a.timestamp));
    }
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('nexus_history');
      setHistory([]);
    }
  };

  const filteredHistory = filter === 'ALL' 
    ? history 
    : history.filter(item => item.type === filter);

  const getIcon = (type: ToolType) => {
    switch (type) {
      case ToolType.CHAT: return '💬';
      case ToolType.IMAGE_GEN: return '🎨';
      case ToolType.VISION: return '👁️';
      case ToolType.SPEECH: return '🎙️';
      default: return '📜';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['ALL', ToolType.CHAT, ToolType.IMAGE_GEN, ToolType.VISION, ToolType.SPEECH].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {f === 'ALL' ? 'All Activity' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button 
          onClick={clearHistory}
          className="text-xs text-red-400 hover:text-red-300 font-medium px-4 py-2 border border-red-400/20 rounded-xl hover:bg-red-400/10 transition-colors"
        >
          Clear All
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
          <div className="text-4xl mb-4">⌛</div>
          <p>No past interactions found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm line-clamp-1">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      {new Date(item.timestamp).toLocaleString()} • {item.type}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 text-sm text-slate-300 max-h-40 overflow-y-auto">
                {item.type === ToolType.IMAGE_GEN ? (
                  <div className="flex gap-4 items-center">
                    <img src={item.content} className="w-24 h-24 rounded-lg object-cover border border-slate-700" alt="Generated" />
                    <p className="italic text-slate-400 text-xs">Prompt: {item.title}</p>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed opacity-80">
                    {typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
