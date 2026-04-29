import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Beaker, Leaf, ShieldCheck, Activity, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAppContext } from '../context/AppContext';
import { DiseaseResult } from '../../types';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResult } = useAppContext();

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center py-8">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-stone-400" size={48} />
          <h1 className="text-2xl font-bold text-stone-900 mb-2">No Analysis Yet</h1>
          <p className="text-stone-600 mb-6">
            Please upload an image to analyze your crop health
          </p>
          <Button onClick={() => navigate('/analyze')} size="lg" className="w-full">
            <Leaf size={20} />
            Go to Analyzer
          </Button>
        </div>
      </div>
    );
  }

  const isStringResult = typeof analysisResult === 'string';
  const result: DiseaseResult | null = !isStringResult ? analysisResult : null;

  if (isStringResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-stone-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            onClick={() => navigate('/analyze')}
            className="mb-6"
          >
            <ArrowLeft size={18} />
            Back to Analyzer
          </Button>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex gap-4 mb-4">
              <Leaf className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h2 className="text-xl font-bold text-stone-900 mb-2">Analysis Result</h2>
                <p className="text-stone-700 whitespace-pre-wrap">{analysisResult}</p>
              </div>
            </div>
          </Card>

          <div className="mt-6 flex gap-3">
            <Button onClick={() => navigate('/chat')} variant="secondary" className="flex-1">
              <Activity size={18} />
              Chat with Expert
            </Button>
            <Button onClick={() => navigate('/analyze')} className="flex-1">
              <Camera size={18} />
              Analyze Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center py-8">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-stone-400" size={48} />
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Error</h1>
          <p className="text-stone-600 mb-6">
            Could not parse analysis result. Please try again.
          </p>
          <Button onClick={() => navigate('/analyze')} size="lg" className="w-full">
            <Leaf size={20} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getCropColor = (crop: string) => {
    return crop === 'Brinjal' ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-stone-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/analyze')}
          className="mb-6"
        >
          <ArrowLeft size={18} />
          Back to Analyzer
        </Button>

        {/* Main Result Card */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Primary Info */}
          <Card className={`lg:col-span-1 bg-gradient-to-br ${getCropColor(result.crop)} text-white border-none`}>
            <div className="space-y-4">
              <div>
                <p className="text-sm opacity-90 font-semibold uppercase tracking-wide">Detected Crop</p>
                <h2 className="text-3xl font-bold mt-1">{result.crop}</h2>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm opacity-90 font-semibold uppercase tracking-wide">Disease</p>
                <h3 className="text-2xl font-bold mt-1">{result.diseaseName}</h3>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm opacity-90 font-semibold uppercase tracking-wide">Confidence</p>
                <div className="mt-2 flex items-end gap-2">
                  <p className="text-4xl font-bold">{result.confidence}%</p>
                  <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Symptoms & Cause */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-600" size={24} />
                Cause & Symptoms
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-600 uppercase font-semibold mb-1">Primary Cause</p>
                  <p className="text-stone-800">{result.cause}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-600 uppercase font-semibold mb-2">Visible Symptoms</p>
                  <ul className="space-y-1">
                    {result.symptoms.map((symptom, idx) => (
                      <li key={idx} className="flex gap-2 text-stone-800">
                        <span className="text-red-600">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Immediate Actions */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-red-200">
              <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Activity className="text-orange-600" size={24} />
                Immediate Actions
              </h3>
              <ul className="space-y-2">
                {result.treatmentPlan.immediate.map((action, idx) => (
                  <li key={idx} className="flex gap-2 text-stone-800">
                    <span className="text-orange-600 font-bold">⚡</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Treatment Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Organic */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Leaf className="text-green-600" size={24} />
              Organic Treatment
            </h3>
            <ul className="space-y-2">
              {result.treatmentPlan.organic.map((treatment, idx) => (
                <li key={idx} className="flex gap-2 text-stone-800 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>{treatment}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Chemical */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Beaker className="text-blue-600" size={24} />
              Chemical Treatment
            </h3>
            <ul className="space-y-2">
              {result.treatmentPlan.chemical.map((treatment, idx) => (
                <li key={idx} className="flex gap-2 text-stone-800 text-sm">
                  <span className="text-blue-600">✓</span>
                  <span>{treatment}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Dosage & Application */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-purple-600" size={24} />
              Application Guide
            </h3>
            <div className="space-y-3 text-sm text-stone-800">
              <div>
                <p className="font-semibold text-purple-700">Dosage</p>
                <p>{result.recommendations.dosage}</p>
              </div>
              <div>
                <p className="font-semibold text-purple-700">Method</p>
                <p>{result.recommendations.applicationMethod}</p>
              </div>
              <div>
                <p className="font-semibold text-purple-700">Frequency</p>
                <p>{result.recommendations.frequency}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={24} />
            Prevention & Long-term Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-stone-600 uppercase font-semibold mb-2">🌾 Recommended Products</p>
              <ul className="space-y-1 text-stone-800 text-sm">
                {result.recommendations.fungicides.map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-stone-600 uppercase font-semibold mb-2">📋 Prevention Steps</p>
              <ul className="space-y-1 text-stone-800 text-sm">
                {result.preventionTips.slice(0, 5).map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button onClick={() => navigate('/analyze')} className="flex-1" size="lg">
            <Leaf size={20} />
            Analyze Another Crop
          </Button>
          <Button onClick={() => navigate('/chat')} variant="outline" className="flex-1" size="lg">
            <Activity size={20} />
            Chat with Expert
          </Button>
        </div>
      </div>
    </div>
  );
};

const Camera = (props: any) => <Leaf {...props} />;
