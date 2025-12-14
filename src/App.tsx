import { useState } from 'react';
import { Language } from './types/language';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ProgramsSection from './components/ProgramsSection';
import MockTestSection from './components/MockTestSection';
import PsychologySection from './components/PsychologySection';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import InternationalizationPage from './components/InternationalizationPage'; // <--- 1. ИМПОРТ

function App() {
  const [language, setLanguage] = useState<Language>('ru');
  const [showTheory, setShowTheory] = useState(false); // <--- 2. НОВОЕ СОСТОЯНИЕ

  // 3. Если состояние true, показываем только страницу теории
  if (showTheory) {
    return <InternationalizationPage onBack={() => setShowTheory(false)} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-uni-primary selection:text-white">
      <Header currentLanguage={language} onLanguageChange={setLanguage} />
      
      <main>
        <Hero language={language} />
        {/* 4. Передаем функцию открытия страницы */}
        <AboutSection 
          language={language} 
          onReadMore={() => setShowTheory(true)} 
        />
        <ProgramsSection language={language} />
        <MockTestSection language={language} />
        <PsychologySection />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}

export default App;