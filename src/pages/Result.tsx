import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Beaker, Leaf, ShieldCheck, Activity, ArrowLeft, ImageIcon } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAppContext } from '../context/AppContext';
import { DiseaseResult } from '../../types';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResult } = useAppContext();

  console.log('Result:', analysisResult);

  // ✅ NO RESULT
  if (!analysisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>⚠️ No analysis found. Please analyze again.</p>
      </div>
    );
  }

  const isStringResult = typeof analysisResult === 'string';

  // ✅ STRING RESPONSE (API ERROR / MESSAGE)
  if (isStringResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{analysisResult}</p>
      </div>
    );
  }

  const result = analysisResult as DiseaseResult;

  // ✅ SAFETY CHECK (MAIN FIX)
  if (!result || !result.diseaseName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>⚠️ Analysis failed. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-4xl mx-auto">

        <Button onClick={() => navigate('/analyze')} className="mb-4">
          <ArrowLeft size={18} />
          Back
        </Button>

        <Card>
          <h2 className="text-xl font-bold mb-4">Analysis Result</h2>

          <p><b>Crop:</b> {result.crop}</p>
          <p><b>Disease:</b> {result.diseaseName}</p>
          <p><b>Confidence:</b> {result.confidence}%</p>

          <hr className="my-3"/>

          <p><b>Cause:</b> {result.cause}</p>

          <h3 className="mt-3 font-bold">Symptoms:</h3>
          <ul>
            {result.symptoms?.map((s, i) => <li key={i}>• {s}</li>)}
          </ul>

          <h3 className="mt-3 font-bold">Treatment:</h3>
          <ul>
            {result.treatmentPlan?.immediate?.map((t, i) => <li key={i}>⚡ {t}</li>)}
          </ul>
        </Card>

        <div className="mt-4 flex gap-3">
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