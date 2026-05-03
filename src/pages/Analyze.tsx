import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
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

  // 📸 Upload Image
  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError("❌ Please upload a valid image file");
    }
  };

  // 📂 File select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  // 🖱️ Drag drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  // 🔍 MAIN ANALYZE FUNCTION (FIXED)
  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError("⚠️ Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeCropHealth(
        selectedImage,
        selectedLanguage,
        contextData
      );

      console.log("API RESULT:", result);

      // ✅ MAIN FIX (IMPORTANT)
      if (!result) {
        setError("❌ Analysis failed. Please try again.");
        return;
      }

      setAnalysisResult(result);

      // small delay for smooth UI
      setTimeout(() => {
        navigate('/result');
      }, 300);

    } catch (err: any) {
      console.error("Analyze Error:", err);

      setError(
        err?.message ||
        "❌ Server error. Please try again later."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-3xl font-bold mb-6">Crop Health Analysis</h1>

        <Card className="p-6">

          {/* Upload Area */}
          {!selectedImage ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed p-10 text-center rounded-lg ${
                isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}
            >
              <Upload className="mx-auto mb-4" size={40} />

              <p className="mb-4">Drag & Drop Image or</p>

              <Button onClick={() => fileInputRef.current?.click()}>
                <Camera size={18} />
                Choose Image
              </Button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="text-center">
              <img
                src={selectedImage}
                className="max-h-80 mx-auto rounded-lg mb-4"
                alt="preview"
              />

              <Button onClick={clearImage} variant="outline">
                <X size={18} />
                Remove Image
              </Button>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* ANALYZE BUTTON */}
          <Button
            onClick={handleAnalyze}
            disabled={!selectedImage || isAnalyzing}
            className="w-full mt-6"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Analyzing...
              </>
            ) : (
              <>
                <Camera size={18} />
                Analyze Crop
              </>
            )}
          </Button>

        </Card>
      </div>
    </div>
  );
};