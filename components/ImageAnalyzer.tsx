
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { analyzePharmacyImage } from '../geminiService';
import { Button } from './Button';

/**
 * Enhanced utility to transform AI Markdown output into structured academic HTML
 * Strips all # markdown symbols while preserving hierarchy
 */
const formatAnalysisText = (text: string) => {
  if (!text) return '';
  
  return text
    // Handle main sections starting with # (completely stripping # symbols)
    .replace(/^#+\s*(.*$)/gim, '<h3 class="font-black text-emerald-700 dark:text-emerald-400 mt-5 mb-2 text-sm uppercase tracking-wider border-b border-emerald-100 dark:border-emerald-900/30 pb-1">$1</h3>')
    // Handle bold keys (**Key:**)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    // Handle bullet points
    .replace(/^[*-]\s+(.*$)/gim, '<div class="flex gap-2 mb-2 ml-1"><span class="text-emerald-500 font-bold">•</span><span class="leading-relaxed">$1</span></div>')
    // Handle LaTeX style arrows
    .replace(/\$\\rightarrow\$/g, '→')
    .replace(/\\rightarrow/g, '→')
    // Handle line breaks
    .replace(/\n/g, '<br />');
};

export const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const parts = image.split(',');
      const base64Data = parts[1];
      const mimeType = parts[0].split(';')[0].split(':')[1];
      const analysis = await analyzePharmacyImage(base64Data, mimeType);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image lab scan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300">
      <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <ICONS.Scan className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Academic Image Lab</h2>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Vision Intelligence System</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className={`relative h-72 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${image ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'}`}>
            {image ? (
              <div className="relative h-full w-full group">
                <img src={image} className="h-full w-full object-contain p-4 rounded-3xl" alt="Scan Preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl backdrop-blur-sm">
                  <p className="text-white font-bold text-sm">Click to Change Image</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ICONS.Download className="w-8 h-8 text-slate-400 rotate-180" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Upload Pharmaceutical Image</p>
                <p className="text-slate-400 text-xs mt-1">Apparatus, Structures, or Notes</p>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={!image || loading} 
            isLoading={loading} 
            variant="primary"
            className="w-full h-14 shadow-emerald-200 dark:shadow-none"
          >
            <ICONS.Scan className="w-5 h-5" />
            {loading ? 'Analyzing Content...' : 'Scan & Identify'}
          </Button>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold border border-red-100 dark:border-red-900/30 flex items-center gap-2">
               <span className="w-5 h-5 flex items-center justify-center bg-red-100 dark:bg-red-900/40 rounded-full font-black">!</span>
               {error}
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b dark:border-slate-800 pb-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Scanner Output Analysis</span>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[450px] scroll-smooth pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-100 dark:border-emerald-900/30 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ICONS.Brain className="w-6 h-6 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Running Vision AI...</p>
              </div>
            ) : result ? (
              <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 academic-text">
                <div dangerouslySetInnerHTML={{ __html: formatAnalysisText(result) }} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-40 grayscale">
                <ICONS.Scan className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500 text-center text-sm font-medium">Ready to scan academic materials...</p>
              </div>
            )}
          </div>
          
          {result && (
            <div className="mt-6 pt-4 border-t dark:border-slate-800 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Source: Vision-AI-Model</span>
              <span>PCI Syllabus Verified</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
