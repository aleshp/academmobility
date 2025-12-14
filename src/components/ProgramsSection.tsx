import { motion } from 'framer-motion';
import { Language } from '../types/language';
import { translations } from '../data/translations';
import { Globe, Award, Users, ArrowUpRight, Download, FileCheck } from 'lucide-react';

export default function ProgramsSection({ language }: { language: Language }) {
  // Данные для программ
  const programs = [
    { icon: Globe, title: 'Erasmus+', desc: translations.erasmus[language] },
    { icon: Award, title: 'Болашақ', desc: translations.bolashak[language] },
    { icon: Users, title: 'Exchange', desc: translations.exchange[language] }
  ];

  // Данные для тестов (перенесли сюда)
  const tests = [
    { name: 'IELTS Academic', min: '6.0', desc: translations.ielts[language] },
    { name: 'TOEFL iBT', min: '80', desc: translations.toefl[language] },
    { name: 'Goethe-Zertifikat', min: 'B2', desc: translations.goethe[language] },
    { name: 'DELF/DALF', min: 'B2', desc: translations.delf[language] },
  ];

  return (
    <section id="programs" className="py-24 bg-uni-gray">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- ЧАСТЬ 1: ПРОГРАММЫ --- */}
        <div className="mb-16">
          <div className="mb-12 border-b border-gray-300 pb-4 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                {translations.programs[language]}
              </h2>
              <p className="text-gray-500 text-sm">Выберите путь своего развития</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 border border-gray-100 hover:border-uni-primary shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-uni-primary/10 transition-colors">
                    <p.icon className="w-8 h-8 text-uni-secondary group-hover:text-uni-primary" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-uni-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{p.desc}</p>
                <a href="#" className="inline-block text-uni-secondary text-sm font-semibold uppercase group-hover:text-uni-primary border-b border-transparent group-hover:border-uni-primary transition-all">
                  Узнать условия
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- ЧАСТЬ 2: ТЕСТЫ (Теперь внутри этого же блока) --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 bg-uni-primary text-white rounded">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-900">
              {translations.tests[language]}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-900 text-xs uppercase tracking-wider font-bold border-t border-b border-gray-200">
                <tr>
                  <th className="p-4">Экзамен</th>
                  <th className="p-4">Мин. Балл</th>
                  <th className="p-4 hidden md:table-cell">Описание</th>
                  <th className="p-4 text-right">Материалы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {tests.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-uni-primary">{t.name}</td>
                    <td className="p-4 font-mono font-semibold bg-gray-50/50">{t.min}</td>
                    <td className="p-4 hidden md:table-cell text-gray-500">{t.desc}</td>
                    <td className="p-4 text-right">
                      <button className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-uni-primary transition border border-gray-200 hover:border-uni-primary px-3 py-1 rounded">
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-gray-400 italic text-center md:text-left">
            * Требования к баллам могут меняться в зависимости от выбранного университета-партнера.
          </p>
        </motion.div>

      </div>
    </section>
  );
}