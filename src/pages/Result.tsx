import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export const Result = () => {
  const navigate = useNavigate();
  const { analysisResult } = useAppContext();

  if (!analysisResult) {
    return <p>No result</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">🌿 Crop Health Result</h2>

      <div className="bg-green-100 p-4 rounded mb-4">
        <h3 className="text-xl font-bold">{analysisResult.disease}</h3>
        <p>Confidence: {analysisResult.confidence}</p>
        <p>Cause: {analysisResult.cause}</p>
      </div>

      <div className="bg-white p-4 rounded mb-4">
        <h3 className="font-bold">Symptoms</h3>
        <ul>
          {analysisResult.symptoms?.map((s: string, i: number) => (
            <li key={i}>• {s}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded mb-4">
        <h3 className="font-bold">Treatment</h3>

        <p className="font-semibold">Immediate</p>
        {analysisResult.treatment?.immediate?.map((t: string, i: number) => (
          <p key={i}>⚡ {t}</p>
        ))}

        <p className="font-semibold mt-2">Organic</p>
        {analysisResult.treatment?.organic?.map((t: string, i: number) => (
          <p key={i}>🌿 {t}</p>
        ))}

        <p className="font-semibold mt-2">Chemical</p>
        {analysisResult.treatment?.chemical?.map((t: string, i: number) => (
          <p key={i}>🧪 {t}</p>
        ))}
      </div>

      <button
        onClick={() => navigate("/analyze")}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Analyze Again
      </button>
    </div>
  );
};