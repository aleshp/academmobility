import { useState } from 'react';
import { Language } from './types/language';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ProgramsSection from './components/ProgramsSection';
// RequirementsSection удален
// TestsSection удален (он теперь внутри Programs)
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

function App() {
  const [language, setLanguage] = useState<Language>('ru');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-uni-primary selection:text-white">
      <Header currentLanguage={language} onLanguageChange={setLanguage} />
      
      <main>
        <Hero language={language} />
        <AboutSection language={language} />
        <ProgramsSection language={language} />
        {/* RequirementsSection и TestsSection больше не нужны здесь */}
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}

export default App;