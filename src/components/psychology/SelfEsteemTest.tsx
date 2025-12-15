import { useState } from 'react';
import { SELF_ESTEEM_TEST } from '../../data/psychologyData';
import { Language } from '../../types/language';

export default function SelfEsteemTest({ language }: { language: Language }) {
  const [idealRanks, setIdealRanks] = useState<Record<string, number>>({});
  const [realRanks, setRealRanks] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ r: number; msg: string } | null>(null);

  const ui = {
    ideal: { ru: 'Идеал', kk: 'Идеал', en: 'Ideal' },
    me: { ru: 'Я', kk: 'Мен', en: 'Me' },
    calc: { ru: 'Рассчитать результат', kk: 'Нәтижені есептеу', en: 'Calculate Result' },
    back: { ru: 'Назад', kk: 'Артқа', en: 'Back' },
    quality: { ru: 'Качество личности', kk: 'Тұлға қасиеті', en: 'Personal Quality' },
    instruction: { 
      ru: 'Расставьте ранги от 1 до 20 (не повторяясь)', 
      kk: '1-ден 20-ға дейін бағалаңыз (қайталанбай)', 
      en: 'Rank from 1 to 20 (no duplicates)' 
    }
  };

  const calculateCorrelation = () => {
    let sumD2 = 0;
    
    SELF_ESTEEM_TEST.qualities.forEach(q => {
      // Используем русское слово как уникальный ключ для расчетов
      const key = q.ru; 
      const d = (idealRanks[key] || 0) - (realRanks[key] || 0);
      sumD2 += d * d;
    });

    // Формула Спирмена
    const r = 1 - (0.00075 * sumD2);
    
    let msg = "";
    const msgs = {
      high: { ru: "Высокая (возможно завышенная) самооценка.", kk: "Жоғары (мүмкін көтеріңкі) өзін-өзі бағалау.", en: "High (possibly inflated) self-esteem." },
      norm: { ru: "Адекватная самооценка.", kk: "Адекватты өзін-өзі бағалау.", en: "Adequate self-esteem." },
      low: { ru: "Низкая самооценка.", kk: "Төмен өзін-өзі бағалау.", en: "Low self-esteem." }
    };

    if (r >= 0.7) msg = msgs.high[language];
    else if (r >= 0.4) msg = msgs.norm[language];
    else msg = msgs.low[language];

    setResult({ r, msg });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-8">
      <h3 className="text-xl font-bold text-uni-primary mb-2">{SELF_ESTEEM_TEST.title[language]}</h3>
      <p className="text-sm text-gray-500 mb-6">{SELF_ESTEEM_TEST.description[language]}</p>
      
      {!result ? (
        <div className="overflow-x-auto">
           <p className="text-xs text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-100 text-center font-bold">
             * {ui.instruction[language]}
           </p>
           <table className="w-full text-sm">
             <thead>
               <tr className="bg-gray-100 text-gray-700">
                 <th className="p-3 text-left rounded-l-lg">{ui.quality[language]}</th>
                 <th className="p-3 w-24 text-center">{ui.ideal[language]}</th>
                 <th className="p-3 w-24 text-center rounded-r-lg">{ui.me[language]}</th>
               </tr>
             </thead>
             <tbody>
               {SELF_ESTEEM_TEST.qualities.map((q) => (
                 <tr key={q.ru} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                   <td className="p-3 font-medium text-gray-800">{q[language]}</td>
                   <td className="p-2">
                     <input 
                       type="number" min="1" max="20" 
                       className="w-full border border-gray-300 rounded p-2 text-center focus:ring-2 focus:ring-uni-primary outline-none"
                       onChange={(e) => setIdealRanks({...idealRanks, [q.ru]: parseInt(e.target.value)})}
                     />
                   </td>
                   <td className="p-2">
                     <input 
                       type="number" min="1" max="20" 
                       className="w-full border border-gray-300 rounded p-2 text-center focus:ring-2 focus:ring-uni-primary outline-none"
                       onChange={(e) => setRealRanks({...realRanks, [q.ru]: parseInt(e.target.value)})}
                     />
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           <button 
             onClick={calculateCorrelation} 
             className="mt-8 w-full bg-uni-secondary text-white py-4 rounded-lg font-bold hover:bg-uni-primary transition shadow-md"
           >
             {ui.calc[language]}
           </button>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-100">
           <h4 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-4">Коэффициент корреляции</h4>
           <div className="text-6xl font-bold text-uni-primary mb-6">{result.r.toFixed(2)}</div>
           <p className="text-xl text-gray-900 font-serif mb-8">{result.msg}</p>
           <button onClick={() => setResult(null)} className="px-6 py-2 border border-uni-secondary text-uni-secondary rounded hover:bg-white transition">
             {ui.back[language]}
           </button>
        </div>
      )}
    </div>
  );
}