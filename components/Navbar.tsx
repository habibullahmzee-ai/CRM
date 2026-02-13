
import React from 'react';
import { ToolType } from '../types';

interface NavbarProps {
  activeTool: ToolType;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTool }) => {
  const getTitle = () => {
    switch (activeTool) {
      case ToolType.CHAT: return 'Intelligent Assistant';
      case ToolType.IMAGE_GEN: return 'Image Generation Workspace';
      case ToolType.VISION: return 'Visual Reasoning Engine';
      case ToolType.SPEECH: return 'Neural Voice Studio';
      default: return 'Nexus AI';
    }
  };

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-100">{getTitle()}</h1>
        <div className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          v1.0 Pro
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Latency: 450ms
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
          AI
        </div>
      </div>
    </header>
  );
};
