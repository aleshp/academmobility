// src/components/Header.tsx
import { useState } from 'react';
import { Phone, Mail, Menu, X } from 'lucide-react'; // Добавили Menu и X
import { Language } from '../types/language';
import LanguageSwitcher from './LanguageSwitcher';
import logoUni from '../assets/images/logo.png';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ currentLanguage, onLanguageChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Функция для закрытия меню при клике на ссылку (чтобы удобно было)
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Верхняя полоска контактов (Скрываем на мобильных, чтобы не занимать место) */}
      <div className="bg-uni-secondary text-white py-2 px-6 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +7 (7182) 67-36-85</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> international@margulan.edu.kz</span>
          </div>
          <div className="opacity-80 hover:opacity-100 transition cursor-pointer">
            Student Portal
          </div>
        </div>
      </div>

      {/* Основное меню */}
      <header className="bg-white border-b border-gray-200 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          
          {/* Логотип и Название */}
          <div className="flex items-center gap-3">
            <img src={logoUni} alt="Margulan University" className="h-10 md:h-12 w-auto object-contain" />
            
            {/* ИСПРАВЛЕНИЕ: Убрали hidden, теперь видно всегда */}
            <div className="flex flex-col justify-center">
              <h1 className="text-sm md:text-lg font-serif font-bold text-gray-900 leading-none">
                MARGULAN
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                University
              </span>
            </div>
          </div>
          
          {/* Десктопное меню (Видно только на больших экранах) */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700">
            <a href="#about" className="hover:text-uni-primary transition uppercase tracking-wide">О центре</a>
            <a href="#programs" className="hover:text-uni-primary transition uppercase tracking-wide">Программы</a>
            <a href="#tests" className="hover:text-uni-primary transition uppercase tracking-wide">Тесты</a>
            <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
          </nav>

          {/* Мобильная кнопка меню (Видно только на мобильных) */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-uni-primary transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Выпадающее мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
            <a 
              href="#about" 
              onClick={handleLinkClick}
              className="text-gray-900 font-medium py-2 border-b border-gray-50"
            >
              О центре
            </a>
            <a 
              href="#programs" 
              onClick={handleLinkClick}
              className="text-gray-900 font-medium py-2 border-b border-gray-50"
            >
              Программы
            </a>
            <a 
              href="#tests" 
              onClick={handleLinkClick}
              className="text-gray-900 font-medium py-2 border-b border-gray-50"
            >
              Тесты
            </a>
            
            {/* Переключатель языка для мобильных */}
            <div className="pt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">Язык:</span>
              <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
            </div>

            {/* Контакты для мобильных (так как верхняя полоска скрыта) */}
            <div className="pt-4 mt-2 border-t border-gray-100 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> +7 (7182) 67-36-85</div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> international@margulan.edu.kz</div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}