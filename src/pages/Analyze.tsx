import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeCropHealth } from "../../services/geminiService";
import { useAppContext } from "../context/AppContext";

export const Analyze: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAnalysisResult, contextData, selectedLanguage } = useAppContext();

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return alert("Upload image first");

    setLoading(true);

    const base64 = image.split(",")[1];

    const res = await analyzeCropHealth(base64, selectedLanguage, contextData);

    setAnalysisResult(res);
    setLoading(false);

    navigate("/result");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🛡️ Crop Health Analyzer
          </h1>
          <p className="text-gray-600 text-lg">
            AI-Powered Disease Detection for Brinjal & Grapes
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
            <h3 className="text-teal-600 font-bold text-lg mb-2">🌾 Supported Crops</h3>
            <p className="text-gray-700 text-sm">
              • Brinjal (Eggplant)<br/>
              • Grapes<br/>
              High accuracy detection
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <h3 className="text-green-600 font-bold text-lg mb-2">⚡ Instant Results</h3>
            <p className="text-gray-700 text-sm">
              Get disease diagnosis<br/>
              Treatment recommendations<br/>
              In seconds
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <h3 className="text-blue-600 font-bold text-lg mb-2">📊 Detailed Analysis</h3>
            <p className="text-gray-700 text-sm">
              Confidence percentage<br/>
              Organic & chemical treatments<br/>
              Prevention tips
            </p>
          </div>
        </div>

        {/* Main Analyzer Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-teal-600 to-green-600 p-8">
            <h2 className="text-white text-2xl font-bold mb-2">📸 Upload Crop Image</h2>
            <p className="text-green-100 text-sm">
              Take a clear photo of affected leaves or fruits for best results
            </p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8">
              <div className={`flex flex-col items-center ${image ? 'opacity-100' : 'opacity-50'}`}>
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <p className="text-sm text-gray-600">Upload Photo</p>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              <div className={`flex flex-col items-center ${loading || image ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${loading ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <p className="text-sm text-gray-600">Analyze</p>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center opacity-50">
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <p className="text-sm text-gray-600">Results</p>
              </div>
            </div>

            {/* Image Upload Area */}
            {!image ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-teal-300 rounded-xl p-12 cursor-pointer hover:border-teal-600 hover:bg-teal-50 transition-all bg-teal-50/30">
                <div className="text-5xl mb-4">🌾</div>
                <p className="text-lg font-semibold text-gray-700 text-center mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 text-center mb-4">
                  JPG, PNG or GIF (Max 5MB)
                </p>
                <p className="text-xs text-gray-400 text-center">
                  📌 Tip: Use clear, well-lit photos of affected leaves or fruits
                </p>
                <input 
                  type="file" 
                  onChange={handleUpload} 
                  hidden 
                  accept="image/*"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={image} 
                    className="w-full h-80 object-cover"
                    alt="Uploaded crop"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setImage(null)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-red-500 hover:text-red-500 font-semibold transition-all"
                  >
                    ✕ Change Image
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-all shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block animate-spin">⏳</span>
                        Analyzing...
                      </span>
                    ) : (
                      "🔍 Analyze Crop"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            {!image && (
              <button
                onClick={handleAnalyze}
                disabled={!image || loading}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white text-lg font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {loading ? "Analyzing..." : "🔍 Analyze Crop"}
              </button>
            )}

            {/* Tips Section */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                💡 Tips for Best Results
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Use natural daylight to get clear images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Focus on affected leaves or fruits, not the whole plant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Ensure the disease symptoms are clearly visible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Hold your phone steady to avoid blurry images</span>
                </li>
              </ul>
            </div>

            {/* About Section */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-gray-900 font-bold mb-2">🌱 About Kissan GPT</h3>
              <p className="text-gray-700 text-sm mb-2">
                Kissan GPT is an AI-powered crop health analyzer designed specifically for Indian farmers. 
                It uses advanced computer vision and machine learning to detect crop diseases instantly.
              </p>
              <p className="text-gray-600 text-xs">
                Supporting Brinjal (Eggplant) and Grapes cultivation with actionable treatment recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};