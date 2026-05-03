import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export const Result = () => {
  const navigate = useNavigate();
  const { analysisResult, uploadedImage } = useAppContext();

  if (!analysisResult) {
    return <p>No result</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-green-600 p-6 relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
          >
            ✕
          </button>
          <h1 className="text-2xl font-bold text-white">🛡️ Crop Health Analyzer</h1>
          <p className="text-green-100 text-sm">Brinjal & Grapes Specialist</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Image Section */}
          {uploadedImage && (
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img 
                src={uploadedImage} 
                alt="Crop" 
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Disease Detection Badge */}
          <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-xl border border-teal-200">
            <p className="text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">
              {analysisResult.crop || 'Crop'} DETECTED
            </p>
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold text-teal-900">{analysisResult.disease}</h2>
              <div className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold">
                {analysisResult.confidence}
              </div>
            </div>
          </div>

          {/* Cause */}
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">💡 Cause:</span> {analysisResult.cause}
            </p>
          </div>

          {/* Symptoms */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">✓ Symptoms Identified</h3>
            <div className="space-y-2">
              {analysisResult.symptoms?.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-teal-600 mt-1">●</span>
                  <p className="text-gray-700">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Plan */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Treatment Plan</h3>
            <div className="space-y-4">
              {/* Immediate Action */}
              {analysisResult.treatment?.immediate && analysisResult.treatment.immediate.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                  <p className="text-blue-700 font-bold uppercase text-xs mb-2">⚡ Immediate Action</p>
                  <ul className="space-y-2">
                    {analysisResult.treatment.immediate.map((t: string, i: number) => (
                      <li key={i} className="text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Organic Solution */}
              {analysisResult.treatment?.organic && analysisResult.treatment.organic.length > 0 && (
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                  <p className="text-green-700 font-bold uppercase text-xs mb-2">🌿 Organic Solution</p>
                  <ul className="space-y-2">
                    {analysisResult.treatment.organic.map((t: string, i: number) => (
                      <li key={i} className="text-gray-700 flex items-start gap-2">
                        <span className="text-green-600">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Chemical Treatment */}
              {analysisResult.treatment?.chemical && analysisResult.treatment.chemical.length > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-lg">
                  <p className="text-amber-700 font-bold uppercase text-xs mb-2">🧪 Chemical Treatment</p>
                  <ul className="space-y-2">
                    {analysisResult.treatment.chemical.map((t: string, i: number) => (
                      <li key={i} className="text-gray-700 flex items-start gap-2">
                        <span className="text-amber-600">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-teal-400">⚙️</span> Smart Recommendations
            </h3>
            {analysisResult.recommendations && (
              <div className="space-y-4">
                {analysisResult.recommendations.fertilizers && (
                  <div>
                    <p className="text-gray-400 text-sm uppercase font-bold mb-2">Fertilizers</p>
                    <p className="text-gray-200">{analysisResult.recommendations.fertilizers}</p>
                  </div>
                )}
                {analysisResult.recommendations.warnings && (
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm uppercase font-bold mb-2">⚠️ Warnings</p>
                    <p className="text-gray-200">{analysisResult.recommendations.warnings}</p>
                  </div>
                )}
                {analysisResult.recommendations.nextSteps && (
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm uppercase font-bold mb-2">Next Steps</p>
                    <p className="text-gray-200">{analysisResult.recommendations.nextSteps}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prevention Tips */}
          {analysisResult.recommendations?.nextSteps && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">🛡️ Prevention Tips</h3>
              <ul className="space-y-2">
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-teal-600">•</span> Monitor your crop regularly for early signs
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-teal-600">•</span> Maintain proper sanitation practices
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-teal-600">•</span> Implement preventive spray schedule
                </li>
                <li className="text-gray-700 flex items-start gap-2">
                  <span className="text-teal-600">•</span> Ensure proper drainage and air circulation
                </li>
              </ul>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => navigate("/analyze")}
            className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            📸 Analyze Another Photo
          </button>
        </div>
      </div>
    </div>
  );
};