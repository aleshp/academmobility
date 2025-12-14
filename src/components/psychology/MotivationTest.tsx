import { useState } from 'react';
import { MOTIVATION_TEST } from '../../data/psychologyData';
import { motion } from 'framer-motion';

export default function MotivationTest() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ VM: number; VPM: number; VOM: number; msg: string } | null>(null);

  const calculateResult = () => {
    // ВМ = (оценка п. 6 + оценка п. 7) / 2
    const VM = ((answers[6] || 0) + (answers[7] || 0)) / 2;
    // ВПМ = (оценка п.1 + оценка п.2 + оценка п.5) / 3
    const VPM = ((answers[1] || 0) + (answers[2] || 0) + (answers[5] || 0)) / 3;
    // ВОМ = оценка п.3 + оценка п.4
    const VOM = (answers[3] || 0) + (answers[4] || 0); // В оригинале сумма, но обычно приводят к среднему для сравнения. Давай оставим как в методике: просто сумма.

    // Интерпретация
    let msg = "";
    // Сравниваем средние значения? В методике ВОМ - это сумма 2х вопросов, а ВПМ - среднее 3х. Это странно для прямого сравнения. 
    // Обычно в тесте Реана сравнивают так: ВМ и ВПМ и ВОМ. 
    // Давай сделаем интерпретацию на основе текста:
    
    // "К наилучшим относятся: ВМ > ВПМ > ВОМ и ВМ = ВПМ > ВОМ"
    // Но так как шкалы разные (сумма vs среднее), это сложно сравнить программно без нормализации.
    // Предположим, что автор имел в виду сырые баллы? 
    // В тексте: "Показателем выраженности... будет число от 1 до 5". 
    // Значит ВОМ тоже нужно делить на 2! (3 и 4 вопросы). 
    
    const VOM_avg = ((answers[3] || 0) + (answers[4] || 0)) / 2;

    if (VM > VPM && VPM > VOM_avg) {
      msg = "Оптимальный мотивационный комплекс! Вами движет интерес к делу.";
    } else if (VOM_avg > VPM && VPM > VM) {
      msg = "Наихудший мотивационный комплекс. Преобладает страх и желание избежать неприятностей.";
    } else {
      msg = "Промежуточный мотивационный комплекс. Внешние и внутренние мотивы смешаны.";
    }

    setResult({ VM, VPM, VOM: VOM_avg, msg });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-uni-primary mb-2">{MOTIVATION_TEST.title}</h3>
      <p className="text-sm text-gray-500 mb-6">{MOTIVATION_TEST.description}</p>

      {!result ? (
        <div className="space-y-6">
          {MOTIVATION_TEST.questions.map((q) => (
            <div key={q.id} className="border-b border-gray-100 pb-4">
              <p className="font-medium text-gray-800 mb-3">{q.id}. {q.text}</p>
              <div className="flex flex-wrap gap-2">
                {MOTIVATION_TEST.scale.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setAnswers({ ...answers, [q.id]: s.value })}
                    className={`px-3 py-1 text-sm rounded border transition-colors ${
                      answers[q.id] === s.value
                        ? 'bg-uni-primary text-white border-uni-primary'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={calculateResult}
            disabled={Object.keys(answers).length < 7}
            className="w-full bg-uni-secondary text-white py-3 rounded-lg font-bold disabled:opacity-50"
          >
            Получить результат
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-700">{result.VM.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Внутренняя (ВМ)</div>
            </div>
            <div className="p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-700">{result.VPM.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Внешняя + (ВПМ)</div>
            </div>
            <div className="p-4 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-700">{result.VOM.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Внешняя - (ВОМ)</div>
            </div>
          </div>
          <p className="font-serif text-lg text-gray-800 mb-4">{result.msg}</p>
          <button onClick={() => setResult(null)} className="text-uni-primary underline text-sm">Проти заново</button>
        </motion.div>
      )}
    </div>
  );
}