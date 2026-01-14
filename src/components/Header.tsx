import { useState } from 'react';
import { Phone, Mail, Menu, X, Globe } from 'lucide-react'; // Добавили Globe
import { Language } from '../types/language';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ currentLanguage, onLanguageChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-uni-secondary text-white py-2 px-6 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +7 702 528 04-42</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> bzhumakeldina@gmail.com</span>
          </div>
          <div className="opacity-80 hover:opacity-100 transition cursor-pointer">
            Student Portal
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          
          {/* НОВЫЙ ЛОГОТИП И НАЗВАНИЕ */}
          <div className="flex items-center gap-3">
            <div className="bg-uni-primary p-2 rounded-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-sm md:text-lg font-serif font-bold text-gray-900 leading-none tracking-wide">
                INTERGLOBAL
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                Center for Internationalization
              </span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-gray-700">
            <a href="#about" className="hover:text-uni-primary transition uppercase tracking-wide">
              Интернационализация
            </a>
            <a href="#programs" className="hover:text-uni-primary transition uppercase tracking-wide">
              Программы
            </a>
            <a href="#mock-test" className="hover:text-uni-primary transition uppercase tracking-wide">
              IELTS Test
            </a>
            <a href="#psychology" className="hover:text-uni-primary transition uppercase tracking-wide">
              Психология
            </a>
            <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-uni-primary transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
            <a href="#about" onClick={handleLinkClick} className="text-gray-900 font-medium py-2 border-b border-gray-50">
              Интернационализация
            </a>
            <a href="#programs" onClick={handleLinkClick} className="text-gray-900 font-medium py-2 border-b border-gray-50">
              Программы
            </a>
            <a href="#mock-test" onClick={handleLinkClick} className="text-gray-900 font-medium py-2 border-b border-gray-50">
              IELTS Test
            </a>
            <a href="#psychology" onClick={handleLinkClick} className="text-gray-900 font-medium py-2 border-b border-gray-50">
              Психология
            </a>
            
            <div className="pt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">Язык:</span>
              <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> +7 702 528 04-42</div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> bzhumakeldina@gmail.com</div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}