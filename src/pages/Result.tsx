import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAppContext } from '../context/AppContext';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResult } = useAppContext();

  if (!analysisResult) {
    return <div className="text-center mt-10">⚠️ No result</div>;
  }

  if (typeof analysisResult === "string") {
    return <div className="text-center mt-10">{analysisResult}</div>;
  }

  const data: any = analysisResult;

  // ✅ MAP BACKEND → UI FORMAT
  const diseaseName = data.disease || "Unknown";
  const confidence = data.confidence || "0%";
  const analysis = data.analysis || "No analysis";
  const treatment = data.treatment || "No treatment";

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-4">🌿 Crop Health Result</h2>

        {/* IMAGE CARD (optional) */}
        <Card>
          <p className="text-sm text-gray-500 mb-2">Detected Disease</p>

          <h1 className="text-3xl font-bold text-green-700">
            {diseaseName}
          </h1>

          <p className="mt-2 text-green-600">
            Confidence: {confidence}
          </p>
        </Card>

        {/* ANALYSIS */}
        <Card className="mt-4">
          <h3 className="font-bold mb-2">🔍 Analysis</h3>
          <p>{analysis}</p>
        </Card>

        {/* SYMPTOMS (FAKE GENERATED FROM TEXT) */}
        <Card className="mt-4">
          <h3 className="font-bold mb-2">🌿 Symptoms</h3>
          <ul className="list-disc pl-5">
            <li>Leaf spots or discoloration</li>
            <li>Yellowing or drying leaves</li>
            <li>Growth reduction</li>
          </ul>
        </Card>

        {/* TREATMENT */}
        <Card className="mt-4">
          <h3 className="font-bold mb-2">💊 Treatment</h3>
          <p>{treatment}</p>
        </Card>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate('/analyze')} className="flex-1">
            Analyze Again
          </Button>
          <Button onClick={() => navigate('/chat')} className="flex-1">
            Chat
          </Button>
        </div>

      </div>
    </div>
  );
};