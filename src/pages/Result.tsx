import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResult } = useAppContext();

  if (!analysisResult) {
    return <div className="p-10 text-center">No result found</div>;
  }

  const r = analysisResult;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold">🌿 Crop Health Result</h1>

        {/* DISEASE */}
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Detected Disease</p>
          <h2 className="text-2xl font-bold text-green-700">
            {r.disease}
          </h2>
          <p className="text-green-600 font-semibold">
            Confidence: {r.confidence}
          </p>
        </div>

        {/* CAUSE */}
        <div className="bg-white p-5 rounded-xl shadow">
          <p><b>Cause:</b> {r.cause}</p>
        </div>

        {/* SYMPTOMS */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-bold mb-2">🌿 Symptoms Identified</h3>
          <ul className="list-disc ml-6">
            {r.symptoms?.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* TREATMENT */}
        <div className="bg-white p-5 rounded-xl shadow space-y-3">

          <h3 className="font-bold">🧪 Treatment Plan</h3>

          <div>
            <h4 className="font-semibold text-blue-600">
              Immediate Action
            </h4>
            <ul className="ml-6 list-disc">
              {r.treatment?.immediate?.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-green-600">
              Organic Solution
            </h4>
            <ul className="ml-6 list-disc">
              {r.treatment?.organic?.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-orange-600">
              Chemical Treatment
            </h4>
            <ul className="ml-6 list-disc">
              {r.treatment?.chemical?.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* SMART */}
        <div className="bg-black text-green-400 p-5 rounded-xl">
          <h3 className="font-bold mb-2">⚡ Smart Recommendations</h3>

          <p><b>Fungicides:</b> {r.smart?.fungicides}</p>
          <p><b>Dosage:</b> {r.smart?.dosage}</p>
          <p><b>Method:</b> {r.smart?.method}</p>
          <p><b>Frequency:</b> {r.smart?.frequency}</p>
        </div>

        {/* PREVENTION */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-bold">🛡 Prevention Tips</h3>
          <ul className="list-disc ml-6">
            {r.prevention?.map((p: string, i: number) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/analyze")}
          className="w-full bg-green-600 text-white py-3 rounded-xl"
        >
          Analyze Another Photo
        </button>

      </div>
    </div>
  );
};