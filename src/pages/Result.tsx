import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data: any = location.state;

  if (!data) {
    return <h2 className="p-6">❌ No result found</h2>;
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          🌿 Crop Health Analyzer
        </h1>

        {/* MAIN CARD */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-green-600 font-semibold">
                {data.crop.toUpperCase()} DETECTED
              </p>

              <h2 className="text-3xl font-bold">
                {data.diseaseName}
              </h2>
            </div>

            <div className="text-right">
              <p className="text-green-600 font-semibold">Confidence</p>
              <p className="text-2xl font-bold text-green-700">
                {data.confidence}%
              </p>
            </div>
          </div>

          <div className="bg-green-100 p-4 rounded mt-4">
            <b>Cause:</b> {data.cause}
          </div>
        </div>

        {/* SYMPTOMS */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="font-bold text-lg mb-3">🌱 Symptoms Identified</h3>
          <ul className="space-y-2">
            {data.symptoms?.map((s: any, i: number) => (
              <li key={i} className="bg-gray-100 p-2 rounded">
                ✔ {s}
              </li>
            ))}
          </ul>
        </div>

        {/* TREATMENT */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="font-bold text-lg mb-3">🧪 Treatment Plan</h3>

          <div className="bg-blue-100 p-4 rounded mb-3">
            <h4 className="font-bold">Immediate Action</h4>
            {data.treatmentPlan?.immediate?.map((t: any, i: number) => (
              <p key={i}>• {t}</p>
            ))}
          </div>

          <div className="bg-green-100 p-4 rounded mb-3">
            <h4 className="font-bold">Organic Solution</h4>
            {data.treatmentPlan?.organic?.map((t: any, i: number) => (
              <p key={i}>• {t}</p>
            ))}
          </div>

          <div className="bg-yellow-100 p-4 rounded">
            <h4 className="font-bold">Chemical Treatment</h4>
            {data.treatmentPlan?.chemical?.map((t: any, i: number) => (
              <p key={i}>• {t}</p>
            ))}
          </div>
        </div>

        {/* SMART */}
        <div className="bg-black text-green-300 p-6 rounded-xl mb-6">
          <h3 className="font-bold mb-3">⚡ Smart Recommendations</h3>

          <p><b>Fungicides:</b> {data.smart?.fungicides}</p>
          <p><b>Dosage:</b> {data.smart?.dosage}</p>
          <p><b>Method:</b> {data.smart?.method}</p>
          <p><b>Frequency:</b> {data.smart?.frequency}</p>
        </div>

        {/* PREVENTION */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="font-bold mb-3">🛡 Prevention Tips</h3>
          <ul>
            {data.prevention?.map((p: any, i: number) => (
              <li key={i}>• {p}</li>
            ))}
          </ul>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/analyze")}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-bold"
        >
          Analyze Another Photo
        </button>

      </div>
    </div>
  );
};