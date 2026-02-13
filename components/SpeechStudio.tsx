
import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { ToolType } from '../types';

interface Props {
  onSaveHistory: (entry: any) => void;
}

export const SpeechStudio: React.FC<Props> = ({ onSaveHistory }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voice, setVoice] = useState('Kore');

  const voices = [
    { id: 'Kore', name: 'Kore (Male, Professional)' },
    { id: 'Puck', name: 'Puck (Male, Youthful)' },
    { id: 'Charon', name: 'Charon (Deep, Mature)' },
    { id: 'Fenrir', name: 'Fenrir (Balanced, Warm)' },
    { id: 'Zephyr', name: 'Zephyr (Calm, Soft)' },
  ];

  const handleGenerate = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const b64Data = await generateSpeech(text, voice);
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binaryString = atob(b64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const audioBuffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
      
      setAudioUrl('playing');
      setTimeout(() => setAudioUrl(null), audioBuffer.duration * 1000);

      // Save to global history
      onSaveHistory({
        type: ToolType.SPEECH,
        title: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        content: `Voice: ${voice} | Script: ${text}`,
      });

    } catch (error) {
      console.error(error);
      alert("Speech generation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-600/20">🎙️</span>
          Speech Studio
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Script Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-100 min-h-[200px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select Voice</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
              >
                {voices.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !text.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold h-[46px] rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                   <span className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                     Generating...
                   </span>
                ) : (
                  <>
                    <span>Generate & Play Audio</span>
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      ▶️
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {audioUrl === 'playing' && (
          <div className="mt-8 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center gap-4 animate-pulse">
            <div className="flex gap-1 items-center">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-1 bg-indigo-400 rounded-full" style={{ height: `${Math.random() * 20 + 5}px` }}></div>
              ))}
            </div>
            <span className="text-indigo-400 font-bold text-sm">Now Playing Synthetic Voice...</span>
          </div>
        )}
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Tips for best results</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 list-disc pl-4">
          <li>Use commas for short pauses in the speech.</li>
          <li>Exclamation marks (!) add subtle emphasis.</li>
          <li>Periods (.) mark clear breaks between thoughts.</li>
          <li>Keep scripts under 500 characters for optimal performance.</li>
        </ul>
      </div>
    </div>
  );
};
