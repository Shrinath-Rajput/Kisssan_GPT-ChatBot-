import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { analyzeCropHealth } from '../../services/geminiService';
import { useAppContext } from '../context/AppContext';

export const Analyze: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLanguage, contextData } = useAppContext();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError("Upload image first");
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

      console.log("RESULT:", result);

      if (!result || typeof result === "string") {
        setError("Analysis failed");
        return;
      }

      // ✅ MAIN FIX
      navigate("/result", { state: result });

    } catch (err) {
      setError("Server error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleImageUpload(e.target.files![0])}
      />

      {selectedImage && (
        <img src={selectedImage} className="h-60 mt-4" />
      )}

      {error && <p className="text-red-500">{error}</p>}

      <button onClick={handleAnalyze} className="mt-4 bg-green-600 text-white p-2">
        Analyze Crop
      </button>
    </div>
  );
};