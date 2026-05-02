import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, CheckCircle2, AlertCircle, Beaker, Leaf, ShieldCheck, Activity } from 'lucide-react';
import { analyzeCropHealth } from '../services/geminiService';
import { AppContextData, Language, DiseaseResult } from '../types';

interface CropHealthAnalyzerProps {
  contextData: AppContextData;
  language: Language;
  onClose: () => void;
}

export const CropHealthAnalyzer: React.FC<CropHealthAnalyzerProps> = ({ contextData, language, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseResult | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeCropHealth(selectedImage, language, contextData);
      setResult(analysisResult);
    } catch (error) {
      const errorMsg = (error as any)?.message || String(error);
      console.error('❌ Analysis error:', error);
      setResult(`❌ Analysis failed: ${errorMsg}\n\nPlease check:\n1. GEMINI_API_KEY is set in Backend Variables\n2. Backend service is running\n3. VITE_API_URL is correct\n\nCheck browser console for more details.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-emerald-600 text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck /> Crop Health Analyzer
            </h2>
            <p className="text-emerald-100 text-sm">Brinjal & Grapes Specialist</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {!selectedImage ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-stone-200 rounded-3xl bg-stone-50">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Upload Leaf Photo</h3>
              <p className="text-stone-500 text-center max-w-xs mb-6 px-4">
                Take a clear photo of the affected part of your Brinjal or Grape plant.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  <Camera size={20} /> Choose Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-lg aspect-video bg-stone-100">
                <img src={selectedImage} alt="Crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {!result && !isAnalyzing && (
                  <button 
                    onClick={reset}
                    className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Action / Loading */}
              {!result && (
                <button 
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" /> Analyzing Crop Health...
                    </>
                  ) : (
                    <>
                      <Activity size={20} /> Start AI Detection
                    </>
                  )}
                </button>
              )}

              {/* Result Section */}
              {result && typeof result === 'object' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Summary Card */}
                  <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full mb-1 inline-block">
                          {result.crop} Detected
                        </span>
                        <h3 className="text-2xl font-bold text-emerald-900">{result.diseaseName}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-emerald-600 font-bold mb-1">Confidence</div>
                        <div className="text-xl font-black text-emerald-700">{(result.confidence * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-800 text-sm bg-white/50 p-3 rounded-xl">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <p><span className="font-bold">Cause:</span> {result.cause}</p>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                      <Leaf size={18} className="text-emerald-600" /> Symptoms Identified
                    </h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {result.symptoms.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-100">
                          <CheckCircle2 size={14} className="text-emerald-500" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment Plan */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-stone-800 flex items-center gap-2">
                      <Beaker size={18} className="text-emerald-600" /> Treatment Plan
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h5 className="text-xs font-bold text-blue-700 uppercase mb-2">Immediate Action</h5>
                        <ul className="text-sm text-blue-900 space-y-1">
                          {result.treatmentPlan.immediate.map((t, i) => <li key={i}>• {t}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <h5 className="text-xs font-bold text-green-700 uppercase mb-2">Organic Solution</h5>
                        <ul className="text-sm text-green-900 space-y-1">
                          {result.treatmentPlan.organic.map((t, i) => <li key={i}>• {t}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <h5 className="text-xs font-bold text-amber-700 uppercase mb-2">Chemical Treatment</h5>
                        <ul className="text-sm text-amber-900 space-y-1">
                          {result.treatmentPlan.chemical.map((t, i) => <li key={i}>• {t}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-stone-900 text-white p-6 rounded-3xl">
                    <h4 className="font-bold mb-4 flex items-center gap-2 text-emerald-400">
                      <Activity size={18} /> Smart Recommendations
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                      <div>
                        <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">Fertilizers</span>
                        <p className="font-medium">{result.recommendations.fertilizers.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">Fungicides</span>
                        <p className="font-medium">{result.recommendations.fungicides.join(', ')}</p>
                      </div>
                    </div>
                    <div className="bg-stone-800 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-400">Dosage</span>
                        <span className="font-bold text-emerald-400">{result.recommendations.dosage}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-400">Method</span>
                        <span className="font-bold text-emerald-400">{result.recommendations.applicationMethod}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-400">Frequency</span>
                        <span className="font-bold text-emerald-400">{result.recommendations.frequency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Prevention */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <h4 className="font-bold text-stone-800 mb-2 text-sm">Prevention Tips</h4>
                    <ul className="text-xs text-stone-600 space-y-1">
                      {result.preventionTips.map((p, i) => <li key={i}>• {p}</li>)}
                    </ul>
                  </div>

                  <button 
                    onClick={reset}
                    className="w-full py-3 text-stone-500 font-bold hover:text-stone-800 transition-colors"
                  >
                    Analyze Another Photo
                  </button>
                </div>
              )}

              {/* Error State */}
              {result && typeof result === 'string' && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
                  <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
                  <p className="text-red-900 font-medium mb-4">{result}</p>
                  <button 
                    onClick={reset}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
