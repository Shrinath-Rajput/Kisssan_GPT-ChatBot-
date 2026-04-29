import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Leaf, BarChart3, MessageCircle, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Cloud,
      title: 'Weather Monitor',
      description: 'Real-time weather and rainfall predictions',
      color: 'from-blue-500 to-blue-600',
      path: '/weather'
    },
    {
      icon: Leaf,
      title: 'Crop Analyzer',
      description: 'AI-powered disease detection and diagnosis',
      color: 'from-green-500 to-green-600',
      path: '/analyze'
    },
    {
      icon: BarChart3,
      title: 'Soil Health',
      description: 'Soil nutrition and moisture tracking',
      color: 'from-amber-500 to-amber-600',
      path: '/'
    },
    {
      icon: MessageCircle,
      title: 'AI Chat',
      description: 'Expert advice in your preferred language',
      color: 'from-purple-500 to-purple-600',
      path: '/chat'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-stone-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
                Kissan GPT 🌿
              </h1>
              <p className="text-xl text-emerald-700 font-semibold">
                Brinjal & Grapes Specialist
              </p>
            </div>

            <p className="text-lg text-stone-600 leading-relaxed">
              Your AI-powered agricultural advisor. Detect crop diseases, get treatment plans, and receive expert guidance in your preferred language.
            </p>

            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/analyze')}
                className="w-full sm:w-auto"
              >
                <Leaf size={20} />
                Start Analysis
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/weather')}
                className="w-full sm:w-auto"
              >
                <Cloud size={20} />
                Check Weather
              </Button>
            </div>

            <div className="pt-4 space-y-2 text-sm text-stone-600">
              <p>✅ Brinjal (Eggplant) Disease Detection</p>
              <p>✅ Grapes Disease Diagnosis</p>
              <p>✅ Treatment Plans & Recommendations</p>
              <p>✅ Support: English, Hindi, Marathi</p>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-3xl flex items-center justify-center shadow-lg">
              <Leaf size={200} className="text-emerald-600 opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            What You Can Do
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Complete agricultural intelligence at your fingertips
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                onClick={() => navigate(feature.path)}
                className="hover:scale-105 transform transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 text-white`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{feature.title}</h3>
                <p className="text-stone-600 text-sm mb-4">{feature.description}</p>
                <div className="flex items-center text-emerald-600 font-semibold text-sm">
                  Explore <ChevronRight size={16} />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Improve Your Harvest?
          </h2>
          <p className="text-emerald-100 text-lg">
            Start by uploading a crop image or checking your local weather
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/analyze')}
            >
              <Leaf size={20} />
              Analyze Crop
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/chat')}
              className="border-white text-white hover:bg-emerald-500"
            >
              <MessageCircle size={20} />
              Chat with Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
