import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Home } from './Home';
import { Weather } from './Weather';
import { Analyze } from './Analyze';
import { Result } from './Result';
import { Chat } from './Chat';
import { AppProvider, useAppContext } from '../context/AppContext';

const AppContent: React.FC = () => {
  const { selectedLanguage, setSelectedLanguage } = useAppContext();

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang as any);
  };

  return (
    <Router>
      <div className="bg-stone-50 min-h-screen">
        <Navbar selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/result" element={<Result />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
