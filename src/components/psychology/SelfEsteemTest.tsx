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
    calc: { ru: 'Рассчитать', kk: 'Есептеу', en: 'Calculate' },
    back: { ru: 'Назад', kk: 'Артқа', en: 'Back' },
    quality: { ru: 'Качество', kk: 'Қасиет', en: 'Quality' }
  };

  const calculateCorrelation = () => {
    let sumD2 = 0;
    const n = SELF_ESTEEM_TEST.qualities.length;

    SELF_ESTEEM_TEST.qualities.forEach(q => {
      // Используем русский ключ для идентификации, так как он уникален
      const key = q.ru; 
      const d = (idealRanks[key] || 0) - (realRanks[key] || 0);
      sumD2 += d * d;
    });

    const r = 1 - (0.00075 * sumD2);
    
    let msg = "";
    const msgs = {
      high: { ru: "Высокая (завышенная).", kk: "Жоғары (көтеріңкі).", en: "High (inflated)." },
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
           <table className="w-full text-sm">
             <thead>
               <tr className="bg-gray-50">
                 <th className="p-2 text-left">{ui.quality[language]}</th>
                 <th className="p-2 w-24">{ui.ideal[language]} (1-20)</th>
                 <th className="p-2 w-24">{ui.me[language]} (1-20)</th>
               </tr>
             </thead>
             <tbody>
               {SELF_ESTEEM_TEST.qualities.map((q) => (
                 <tr key={q.ru} className="border-b border-gray-100">
                   <td className="p-2">{q[language]}</td>
                   <td className="p-2">
                     <input 
                       type="number" min="1" max="20" 
                       className="w-full border rounded p-1"
                       onChange={(e) => setIdealRanks({...idealRanks, [q.ru]: parseInt(e.target.value)})}
                     />
                   </td>
                   <td className="p-2">
                     <input 
                       type="number" min="1" max="20" 
                       className="w-full border rounded p-1"
                       onChange={(e) => setRealRanks({...realRanks, [q.ru]: parseInt(e.target.value)})}
                     />
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           <button onClick={calculateCorrelation} className="mt-6 w-full bg-uni-secondary text-white py-3 rounded-lg font-bold">
             {ui.calc[language]}
           </button>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
           <div className="text-5xl font-bold text-uni-primary my-4">{result.r.toFixed(2)}</div>
           <p className="text-gray-800">{result.msg}</p>
           <button onClick={() => setResult(null)} className="mt-4 text-sm underline">{ui.back[language]}</button>
        </div>
      )}
    </div>
  );
}