import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAppContext } from '../context/AppContext';

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

  // ✅ STRING ERROR MESSAGE
  if (typeof analysisResult === 'string') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{analysisResult}</p>
      </div>
    );
  }

  const result: any = analysisResult;

  // ✅ FINAL SAFETY CHECK
  if (!result || (!result.analysis && !result.disease)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>⚠️ Analysis failed. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <Button onClick={() => navigate('/analyze')} className="mb-4">
          <ArrowLeft size={18} />
          Back
        </Button>

        <Card>
          <h2 className="text-xl font-bold mb-4">Analysis Result</h2>

          {/* ✅ SAFE DATA DISPLAY */}
          <p><b>Disease:</b> {result.disease || "Unknown"}</p>
          <p><b>Confidence:</b> {result.confidence || "0%"}</p>

          <hr className="my-3"/>

          <p><b>Analysis:</b> {result.analysis || "No details available"}</p>

          <h3 className="mt-3 font-bold">Treatment:</h3>
          <p>{result.treatment || "No treatment info available"}</p>
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