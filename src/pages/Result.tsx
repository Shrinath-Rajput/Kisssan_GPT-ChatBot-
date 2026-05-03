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
    <div className="min-h-screen bg-green-50 p-6">

      <h1 className="text-2xl font-bold mb-4">🌿 Crop Health Result</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl text-green-700 font-bold">
          {r.disease}
        </h2>
        <p>Confidence: {r.confidence}</p>
        <p>Cause: {r.cause}</p>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-bold">Symptoms</h3>
        {r.symptoms?.map((s: string, i: number) => (
          <p key={i}>• {s}</p>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-bold">Treatment</h3>
        {r.treatment?.immediate?.map((t: string, i: number) => (
          <p key={i}>⚡ {t}</p>
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