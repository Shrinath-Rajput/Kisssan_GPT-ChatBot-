import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, Leaf } from 'lucide-react';

interface NavbarProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Weather', path: '/weather' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Results', path: '/result' },
    { name: 'Chat', path: '/chat' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
              <Leaf className="text-emerald-200" size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg">Kissan GPT 🌿</h1>
              <p className="text-xs text-emerald-100 leading-none">Brinjal & Grapes</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-emerald-500 text-xs border-none rounded-lg px-2 py-2 focus:ring-2 focus:ring-emerald-300 outline-none cursor-pointer hover:bg-emerald-400 transition-colors"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी</option>
              <option value="Marathi">मराठी</option>
            </select>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-emerald-500 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-emerald-500">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
