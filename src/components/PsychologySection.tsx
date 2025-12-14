import { useState } from 'react';
import { Brain, Activity, UserCheck } from 'lucide-react';
import MotivationTest from './psychology/MotivationTest';
import SelfEsteemTest from './psychology/SelfEsteemTest';
import ReadinessTest from './psychology/ReadinessTest';
import { Language } from '../types/language'; // Импортируем тип

// Принимаем language как пропс
interface PsychologySectionProps {
  language: Language;
}

export default function PsychologySection({ language }: PsychologySectionProps) {
  const [activeTab, setActiveTab] = useState<'motivation' | 'esteem' | 'readiness'>('motivation');

  // Переводы для заголовков табов
  const tabs = {
    motivation: { ru: 'Мотивация', kk: 'Мотивация', en: 'Motivation' },
    esteem: { ru: 'Самооценка', kk: 'Өзін-өзі бағалау', en: 'Self-Esteem' },
    readiness: { ru: 'Готовность', kk: 'Дайындық', en: 'Readiness' }
  };

  const headers = {
    title: { ru: 'Психологическая диагностика', kk: 'Психологиялық диагностика', en: 'Psychological Diagnostics' },
    desc: { 
      ru: 'Пройдите тесты, чтобы лучше понять свои профессиональные склонности.',
      kk: 'Кәсіби бейімділіктеріңізді жақсырақ түсіну үшін тесттерден өтіңіз.',
      en: 'Take tests to better understand your professional inclinations.'
    }
  };

  return (
    <section id="psychology" className="py-24 bg-uni-gray">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">{headers.title[language]}</h2>
          <p className="text-gray-600">{headers.desc[language]}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-4">
          <button
            onClick={() => setActiveTab('motivation')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition ${
              activeTab === 'motivation' ? 'bg-uni-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity className="w-4 h-4" /> {tabs.motivation[language]}
          </button>
          <button
            onClick={() => setActiveTab('esteem')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition ${
              activeTab === 'esteem' ? 'bg-uni-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCheck className="w-4 h-4" /> {tabs.esteem[language]}
          </button>
          <button
             onClick={() => setActiveTab('readiness')}
             className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition ${
               activeTab === 'readiness' ? 'bg-uni-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
             }`}
           >
             <Brain className="w-4 h-4" /> {tabs.readiness[language]}
           </button>
        </div>

        {/* Content - передаем language в каждый тест */}
        {activeTab === 'motivation' && <MotivationTest language={language} />}
        {activeTab === 'esteem' && <SelfEsteemTest language={language} />}
        {activeTab === 'readiness' && <ReadinessTest language={language} />}
        
      </div>
    </section>
  );
}