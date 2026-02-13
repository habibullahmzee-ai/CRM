
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ChatInterface } from './components/ChatInterface';
import { ImageGenerator } from './components/ImageGenerator';
import { VisualAnalyzer } from './components/VisualAnalyzer';
import { SpeechStudio } from './components/SpeechStudio';
import { HistoryView } from './components/HistoryView';
import { ToolType, HistoryEntry } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.CHAT);

  const saveToHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const saved = localStorage.getItem('nexus_history');
    const history = saved ? JSON.parse(saved) : [];
    const newEntry: HistoryEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    localStorage.setItem('nexus_history', JSON.stringify([newEntry, ...history]));
  };

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.CHAT:
        return <ChatInterface onSaveHistory={saveToHistory} />;
      case ToolType.IMAGE_GEN:
        return <ImageGenerator onSaveHistory={saveToHistory} />;
      case ToolType.VISION:
        return <VisualAnalyzer onSaveHistory={saveToHistory} />;
      case ToolType.SPEECH:
        return <SpeechStudio onSaveHistory={saveToHistory} />;
      case ToolType.HISTORY:
        return <HistoryView />;
      default:
        return <ChatInterface onSaveHistory={saveToHistory} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar activeTool={activeTool} onToolSelect={setActiveTool} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar activeTool={activeTool} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {renderTool()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
