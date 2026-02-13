
import React from 'react';
import { ToolType } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onToolSelect }) => {
  const menuItems = [
    { id: ToolType.CHAT, label: 'Intelligent Chat', icon: '💬', desc: 'Reasoning & Search' },
    { id: ToolType.IMAGE_GEN, label: 'Image Forge', icon: '🎨', desc: 'Creative Generation' },
    { id: ToolType.VISION, label: 'Visual Insight', icon: '👁️', desc: 'Image Analysis' },
    { id: ToolType.SPEECH, label: 'Speech Studio', icon: '🎙️', desc: 'Text-to-Speech' },
    { id: ToolType.HISTORY, label: 'Past Activity', icon: '📜', desc: 'Revisit Interactions' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            GN
          </div>
          <span className="font-bold text-xl tracking-tight">Gemini Nexus</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onToolSelect(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTool === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-medium text-sm leading-none mb-1">{item.label}</div>
                  <div className={`text-[10px] uppercase tracking-wider opacity-60`}>
                    {item.desc}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-2 font-medium">Power status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold">Gemini Flash Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
