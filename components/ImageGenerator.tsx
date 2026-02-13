
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { GeneratedImage, ToolType } from '../types';

interface Props {
  onSaveHistory: (entry: any) => void;
}

export const ImageGenerator: React.FC<Props> = ({ onSaveHistory }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [aspectRatio, setAspectRatio] = useState<any>('1:1');

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const url = await generateImage(prompt, aspectRatio);
      const newImg: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url,
        prompt,
        timestamp: Date.now()
      };
      setHistory(prev => [newImg, ...prev]);
      
      // Save to global history
      onSaveHistory({
        type: ToolType.IMAGE_GEN,
        title: prompt,
        content: url
      });

    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Please try a different prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🎨</span> Create Art from Text
        </h2>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cybernetic landscape with purple neon towers and flying vehicles, highly detailed digital art style..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-100"
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aspect Ratio:</span>
              <div className="flex gap-1">
                {['1:1', '3:4', '4:3', '16:9'].map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      aspectRatio === ratio 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Generating Art...</span>
                </>
              ) : (
                <>
                  <span>Magic Generate</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-300">
          <span>🕒</span> Recent Sessions
        </h3>
        {history.length === 0 ? (
          <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center">
            <div className="text-4xl mb-4">🖼️</div>
            <p className="text-slate-500">Your generated images will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map(img => (
              <div key={img.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500 transition-all shadow-xl">
                <img src={img.url} alt={img.prompt} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-xs text-slate-100 line-clamp-3 mb-3 bg-slate-900/60 backdrop-blur px-2 py-1.5 rounded-lg border border-slate-700/50">
                    {img.prompt}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = img.url;
                        link.download = `nexus-${img.id}.png`;
                        link.click();
                      }}
                      className="flex-1 bg-white text-slate-950 text-[11px] font-bold py-2 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors"
                    >
                      Download
                    </button>
                    <button 
                      onClick={() => setPrompt(img.prompt)}
                      className="bg-slate-800 text-white text-[11px] font-bold py-2 px-3 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      Remix
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
