import { motion } from 'framer-motion';
import { Language } from '../types/language';
import { translations } from '../data/translations';
import { Globe, Award, Users, ArrowUpRight, FileCheck, ExternalLink, Briefcase, GraduationCap, Plane } from 'lucide-react';

export default function ProgramsSection({ language }: { language: Language }) {
  
  // Обновленный список программ
  const programs = [
    // Студенческие программы
    { 
      icon: Globe, 
      title: 'Erasmus+', 
      desc: translations.erasmus[language],
      link: 'https://erasmus-plus.ec.europa.eu',
      type: 'student'
    },
    { 
      icon: Award, 
      title: 'Болашақ', 
      desc: translations.bolashak[language],
      link: 'https://bolashak.gov.kz',
      type: 'student'
    },
    { 
      icon: Users, 
      title: 'Exchange Partners', 
      desc: translations.exchange[language],
      link: 'https://enic-kazakhstan.edu.kz',
      type: 'student'
    },
    // НОВЫЕ ПРОГРАММЫ
    {
      icon: Plane,
      title: 'Orhun Exchange',
      desc: translations.orhun[language],
      link: 'http://turkunib.org/en/orhun-exchange-program',
      type: 'student'
    },
    {
      icon: GraduationCap,
      title: 'DAAD Germany',
      desc: translations.daad[language],
      link: 'https://www.daad-kazakhstan.org/',
      type: 'student'
    },
    {
      icon: Globe,
      title: 'Global UGRAD',
      desc: translations.ugrad[language],
      link: 'https://kz.usembassy.gov/education-culture/opportunities/global-ugrad/',
      type: 'student'
    },
    // ДЛЯ СОТРУДНИКОВ (Служебные командировки)
    {
      icon: Briefcase,
      title: 'Staff Mobility / 500 Scientists',
      desc: translations.staffMobility[language],
      link: 'https://erasmus-plus.ec.europa.eu/programme-guide/part-b/key-action-1/higher-education-mobility-projects', // Ссылка на 500 ученых
      type: 'staff',
      highlight: true // Выделим цветом
    }
  ];

  // (Массив tests оставляем без изменений, он у тебя уже есть)
  const tests = [
    { name: 'IELTS Academic', min: '6.0', desc: translations.ielts[language], link: 'https://www.ielts.org' },
    { name: 'TOEFL iBT', min: '80', desc: translations.toefl[language], link: 'https://www.ets.org/toefl' },
    { name: 'Goethe-Zertifikat', min: 'B2', desc: translations.goethe[language], link: 'https://www.goethe.de' },
    { name: 'TestDaF', min: 'TDN 4', desc: translations.testdaf[language], link: 'https://www.testdaf.de' },
  ];

  return (
    <section id="programs" className="py-24 bg-uni-gray">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- ЧАСТЬ 1: ПРОГРАММЫ --- */}
        <div className="mb-16">
          <div className="mb-12 border-b border-gray-300 pb-4">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              {translations.programs[language]}
            </h2>
            <p className="text-gray-500 text-sm">Академическая мобильность и стажировки для студентов и преподавателей</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white p-6 rounded-xl border transition-all group flex flex-col relative overflow-hidden ${
                  p.highlight 
                    ? 'border-uni-primary/40 shadow-md shadow-uni-primary/10' 
                    : 'border-gray-100 hover:border-uni-primary/30 hover:shadow-lg'
                }`}
              >
                {/* Бейдж для сотрудников */}
                {p.type === 'staff' && (
                  <div className="absolute top-0 right-0 bg-uni-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Staff Only
                  </div>
                )}

                <div className="mb-4 flex justify-between items-start">
                  <div className={`p-3 rounded-lg transition-colors ${
                    p.highlight ? 'bg-uni-primary/10' : 'bg-gray-50 group-hover:bg-uni-primary/10'
                  }`}>
                    <p.icon className={`w-8 h-8 ${
                      p.highlight ? 'text-uni-primary' : 'text-uni-secondary group-hover:text-uni-primary'
                    }`} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-uni-primary" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-serif">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>
                
                <a 
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-uni-secondary text-xs font-bold uppercase group-hover:text-uni-primary border-b border-transparent group-hover:border-uni-primary transition-all pb-1 w-fit"
                >
                  Официальный сайт <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- ЧАСТЬ 2: ТЕСТЫ (Без изменений) --- */}
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
                  <th className="p-4 text-right">Ресурс</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {tests.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-uni-primary">{t.name}</td>
                    <td className="p-4 font-mono font-semibold bg-gray-50/50">{t.min}</td>
                    <td className="p-4 hidden md:table-cell text-gray-500">{t.desc}</td>
                    <td className="p-4 text-right">
                      <a 
                        href={t.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-uni-secondary hover:text-uni-primary transition border border-gray-200 hover:border-uni-primary px-3 py-2 rounded hover:bg-white"
                      >
                         Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  );
}