import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export const Result: React.FC = () => {
  const { analysisResult } = useAppContext();
  const navigate = useNavigate();

  if (!analysisResult) {
    return <h2>No Result Found</h2>;
  }

  const r: any = analysisResult;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      
      {/* Disease Detection Header */}
      <div className="bg-gradient-to-r from-teal-50 to-green-50 border-l-4 border-teal-600 p-6 rounded-lg mb-6 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm font-bold text-teal-600 tracking-wide mb-1">
              {r.crop?.toUpperCase()} DETECTED
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-teal-800">
              {r.diseaseName}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Confidence</p>
            <p className="text-3xl font-bold text-teal-600">
              {r.confidence}%
            </p>
          </div>
        </div>
        <div className="flex items-center text-teal-700 mt-4">
          <span className="text-xl mr-2">ℹ️</span>
          <p className="text-sm">
            <span className="font-bold">Cause:</span> {r.cause}
          </p>
        </div>
      </div>

      {/* Symptoms Identified */}
      {r.symptoms && r.symptoms.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">🌿</span> Symptoms Identified
          </h2>
          <div className="space-y-3">
            {r.symptoms.map((symptom: string, idx: number) => (
              <div key={idx} className="flex items-start bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-400">
                <span className="text-teal-500 text-xl mr-3 flex-shrink-0">◉</span>
                <p className="text-gray-700">{symptom}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treatment Plan */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">📋</span> Treatment Plan
        </h2>

        {/* Immediate Action */}
        {r.treatmentPlan?.immediate && r.treatmentPlan.immediate.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg mb-4 shadow-sm">
            <h3 className="font-bold text-blue-700 mb-3 text-sm uppercase tracking-wide">
              Immediate Action
            </h3>
            <ul className="space-y-2">
              {r.treatmentPlan.immediate.map((action: string, idx: number) => (
                <li key={idx} className="text-blue-800 flex items-start">
                  <span className="mr-3">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Organic Solution */}
        {r.treatmentPlan?.organic && r.treatmentPlan.organic.length > 0 && (
          <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-lg mb-4 shadow-sm">
            <h3 className="font-bold text-green-700 mb-3 text-sm uppercase tracking-wide">
              Organic Solution
            </h3>
            <ul className="space-y-2">
              {r.treatmentPlan.organic.map((organic: string, idx: number) => (
                <li key={idx} className="text-green-800 flex items-start">
                  <span className="mr-3">•</span>
                  <span>{organic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chemical Treatment */}
        {r.treatmentPlan?.chemical && r.treatmentPlan.chemical.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-600 p-5 rounded-lg shadow-sm">
            <h3 className="font-bold text-amber-700 mb-3 text-sm uppercase tracking-wide">
              Chemical Treatment
            </h3>
            <ul className="space-y-2">
              {r.treatmentPlan.chemical.map((chemical: string, idx: number) => (
                <li key={idx} className="text-amber-900 flex items-start">
                  <span className="mr-3">•</span>
                  <span>{chemical}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Smart Recommendations */}
      {r.recommendations && (
        <div className="bg-gray-900 text-white p-6 rounded-lg mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="text-2xl mr-2">⚡</span> Smart Recommendations
          </h2>

          {/* Fertilizers and Fungicides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Fertilizers */}
            {r.recommendations.fertilizers && r.recommendations.fertilizers.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-3">
                  Fertilizers
                </h3>
                <p className="text-white leading-relaxed">
                  {r.recommendations.fertilizers.join(", ")}
                </p>
              </div>
            )}

            {/* Fungicides */}
            {r.recommendations.fungicides && r.recommendations.fungicides.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-3">
                  Fungicides
                </h3>
                <p className="text-white leading-relaxed">
                  {r.recommendations.fungicides.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Dosage, Method, Frequency */}
          <div className="bg-gray-800 p-4 rounded-lg space-y-4">
            {r.recommendations.dosage && (
              <div>
                <p className="text-gray-400 text-sm font-bold mb-2">Dosage</p>
                <p className="text-teal-400 text-sm leading-relaxed">
                  {r.recommendations.dosage}
                </p>
              </div>
            )}

            {r.recommendations.applicationMethod && (
              <div>
                <p className="text-gray-400 text-sm font-bold mb-2">Method</p>
                <p className="text-teal-400 text-sm leading-relaxed">
                  {r.recommendations.applicationMethod}
                </p>
              </div>
            )}

            {r.recommendations.frequency && (
              <div>
                <p className="text-gray-400 text-sm font-bold mb-2">Frequency</p>
                <p className="text-teal-400 text-sm leading-relaxed">
                  {r.recommendations.frequency}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prevention Tips */}
      {r.preventionTips && r.preventionTips.length > 0 && (
        <div className="bg-white p-6 rounded-lg mb-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Prevention Tips
          </h2>
          <ul className="space-y-3">
            {r.preventionTips.map((tip: string, idx: number) => (
              <li key={idx} className="text-gray-700 flex items-start">
                <span className="text-teal-600 font-bold mr-3">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analyze Another Photo Button */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate("/analyze")}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors duration-200"
        >
          Analyze Another Photo
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};