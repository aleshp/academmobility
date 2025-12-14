import { useState } from 'react';
import { Brain, Activity, UserCheck } from 'lucide-react';
import MotivationTest from './psychology/MotivationTest';
import SelfEsteemTest from './psychology/SelfEsteemTest';
// import ReadinessTest from './psychology/ReadinessTest'; // Подключишь, когда сделаешь

export default function PsychologySection() {
  const [activeTab, setActiveTab] = useState<'motivation' | 'esteem' | 'readiness'>('motivation');

  return (
    <section id="psychology" className="py-24 bg-uni-gray">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Психологическая диагностика</h2>
          <p className="text-gray-600">
            Пройдите тесты, чтобы лучше понять свои профессиональные склонности и готовность к обучению за рубежом.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setActiveTab('motivation')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition ${
              activeTab === 'motivation' ? 'bg-uni-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity className="w-4 h-4" /> Мотивация
          </button>
          <button
            onClick={() => setActiveTab('esteem')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition ${
              activeTab === 'esteem' ? 'bg-uni-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Самооценка
          </button>
          <button
             onClick={() => setActiveTab('readiness')}
             className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition ${
               activeTab === 'readiness' ? 'bg-uni-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
             }`}
           >
             <Brain className="w-4 h-4" /> Готовность
           </button>
        </div>

        {/* Content */}
        {activeTab === 'motivation' && <MotivationTest />}
        {activeTab === 'esteem' && <SelfEsteemTest />}
        {activeTab === 'readiness' && (
          <div className="bg-white p-8 rounded-xl text-center border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Тест "Профессиональная готовность"</h3>
            <p className="text-gray-500">
              Этот тест содержит 99 вопросов и требует детальной проработки. 
              (Сюда нужно вставить компонент ReadinessTest после полного заполнения базы данных).
            </p>
          </div>
        )}
        
      </div>
    </section>
  );
}