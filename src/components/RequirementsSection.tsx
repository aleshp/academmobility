import { motion } from 'framer-motion';
import { CheckCircle2, FileText, AlertTriangle, GraduationCap } from 'lucide-react';
import { Language } from '../types/language';

export default function RequirementsSection({ language }: { language: Language }) {

  const content = {
    title: {
      ru: 'Условия участия (SPA)',
      kk: 'Қатысу шарттары (SPA)',
      en: 'Participation Conditions (SPA)'
    },
    subtitle: {
      ru: 'Критерии отбора для академической мобильности',
      kk: 'Академиялық ұтқырлыққа іріктеу критерийлері',
      en: 'Selection criteria for academic mobility'
    },
    requirements: {
      title: { ru: 'Требования к студенту', kk: 'Студентке қойылатын талаптар', en: 'Student Requirements' },
      list: [
        { ru: 'GPA не ниже 3.0 (или B)', kk: 'GPA 3.0 төмен емес (немесе B)', en: 'GPA not lower than 3.0' },
        { ru: 'Уровень языка B2 (IELTS 5.5+ / TOEFL 46+)', kk: 'Тіл деңгейі B2 (IELTS 5.5+)', en: 'Language level B2 (IELTS 5.5+)' },
        { ru: 'Отсутствие академических задолженностей', kk: 'Академиялық қарыздардың болмауы', en: 'No academic debts' },
        { ru: 'Отсутствие дисциплинарных взысканий', kk: 'Тәртіптік жазалардың болмауы', en: 'No disciplinary records' },
        { ru: 'Обучение на 2-3 курсе (Бакалавриат)', kk: '2-3 курс студенті (Бакалавриат)', en: '2nd-3rd year student (Bachelor)' }
      ]
    },
    documents: {
      title: { ru: 'Пакет документов', kk: 'Құжаттар тізімі', en: 'Required Documents' },
      list: [
        { ru: 'Заявление на имя ректора', kk: 'Ректордың атына өтініш', en: 'Application to the Rector' },
        { ru: 'Транскрипт (3 языка)', kk: 'Транскрипт (3 тілде)', en: 'Transcript (3 languages)' },
        { ru: 'Языковой сертификат', kk: 'Тіл сертификаты', en: 'Language certificate' },
        { ru: 'Копия паспорта', kk: 'Төлқұжат көшірмесі', en: 'Passport copy' },
        { ru: 'Медицинская справка 072/у', kk: '072/у медициналық анықтама', en: 'Medical certificate 072/u' }
      ]
    },
    note: {
      ru: 'Внимание: Расходы на перелет, визу и страховку обычно покрываются студентом самостоятельно (кроме грантовых программ Erasmus/Orhun).',
      kk: 'Назар аударыңыз: Ұшу, виза және сақтандыру шығындарын әдетте студент өз бетінше өтейді (Erasmus/Orhun гранттарынан басқа).',
      en: 'Note: Flight, visa, and insurance costs are usually covered by the student (except for Erasmus/Orhun grants).'
    }
  };

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">{content.title[language]}</h2>
          <p className="text-gray-500">{content.subtitle[language]}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: Requirements */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-uni-gray/50 p-8 rounded-2xl border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-uni-primary rounded-full flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{content.requirements.title[language]}</h3>
            </div>
            
            <ul className="space-y-4">
              {content.requirements.list.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{item[language]}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 2: Documents */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-uni-secondary p-8 rounded-2xl text-white shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-uni-accent">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">{content.documents.title[language]}</h3>
            </div>
            
            <ul className="space-y-4">
              {content.documents.list.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 border-b border-white/10 pb-2 last:border-0">
                  <div className="w-1.5 h-1.5 bg-uni-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-200">{item[language]}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Warning Note */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex items-start gap-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-600" />
          <p>{content.note[language]}</p>
        </motion.div>

      </div>
    </section>
  );
}