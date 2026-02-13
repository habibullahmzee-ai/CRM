
import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { ToolType } from '../types';

interface Props {
  onSaveHistory: (entry: any) => void;
}

export const VisualAnalyzer: React.FC<Props> = ({ onSaveHistory }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail.');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image || isLoading) return;
    setIsLoading(true);
    try {
      const analysis = await analyzeImage(image, prompt);
      const output = analysis || "Could not analyze image.";
      setResult(output);
      
      // Save to global history
      onSaveHistory({
        type: ToolType.VISION,
        title: prompt,
        content: output,
      });

    } catch (error) {
      console.error(error);
      setResult("Error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📷</span> Upload Image
          </h2>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video bg-slate-800 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700 hover:border-indigo-500 transition-all overflow-hidden group"
          >
            {image ? (
              <img src={image} className="w-full h-full object-contain" alt="Preview" />
            ) : (
              <>
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📤
                </div>
                <p className="mt-4 text-sm font-medium text-slate-300">Click to upload photo</p>
                <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP</p>
              </>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <div className="mt-6 space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question or Task</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-100"
              rows={3}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || isLoading}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col min-h-[400px]">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-4">
          <span>🧠</span> Analysis Result
        </h2>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400 font-medium">Extracting information...</p>
            </div>
          ) : result ? (
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 opacity-60">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-sm">Upload an image and ask a question to see the AI's deep analysis here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
