import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { analyzeCropHealth } from '../../services/geminiService';
import { useAppContext } from '../context/AppContext';

export const Analyze: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLanguage, contextData, setAnalysisResult } = useAppContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeCropHealth(selectedImage, selectedLanguage, contextData);
      setAnalysisResult(result);
      setTimeout(() => navigate('/result'), 500);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Crop Health Analysis</h1>
          <p className="text-stone-600">Upload a clear photo of your Brinjal or Grape plant</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <Card className="h-full">
              {!selectedImage ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-2xl transition-all ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-stone-200 bg-stone-50 hover:border-emerald-400'
                  }`}
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    Drag & drop your image
                  </h3>
                  <p className="text-stone-500 text-center mb-6 px-4">
                    Or click the button below to browse
                  </p>
                  <div className="flex flex-col gap-3 w-full px-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Camera size={20} />
                      Choose Photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-xs text-stone-500 text-center">
                      JPG, PNG, or WebP • Max 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-4 w-full">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-cover rounded-xl border-2 border-emerald-500"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-stone-600 mb-4">Image ready for analysis</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                  >
                    Change Image
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Instructions & CTA */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
              <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                📸 Photography Tips
              </h3>
              <ul className="space-y-3 text-sm text-stone-700">
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Clear, well-lit photo of the affected area</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Close-up of leaves or stems showing symptoms</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Avoid blur and shadows</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Show multiple angles if possible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Include healthy and affected parts</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                🎯 What We Detect
              </h3>
              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex gap-2">
                  <span className="text-blue-600">🥒</span>
                  <span><strong>Brinjal:</strong> Leaf Spot, Bacterial Wilt, etc.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">🍇</span>
                  <span><strong>Grapes:</strong> Powdery Mildew, Downy Mildew, etc.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">📊</span>
                  <span>Disease confidence and severity</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">💊</span>
                  <span>Organic & Chemical treatments</span>
                </li>
              </ul>
            </Card>

            {/* Error Message Display */}
            {error && (
              <Card className="bg-red-50 border-red-200">
                <p className="text-sm text-red-900 whitespace-pre-wrap">{error}</p>
              </Card>
            )}

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
              size="lg"
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Camera size={20} />
                  Analyze Crop Health
                </>
              )}
            </Button>

            {/* Current Location */}
            <Card className="bg-stone-100">
              <p className="text-xs text-stone-600 uppercase font-semibold mb-2">
                📍 Analysis Context
              </p>
              <p className="text-sm font-medium text-stone-800">
                {contextData.weather.location}
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Temp: {contextData.weather.temp}°C | Condition: {contextData.weather.condition}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
