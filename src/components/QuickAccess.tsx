import { motion } from 'framer-motion';
import { ExternalLink, MousePointerClick, FileText } from 'lucide-react';
import { Language } from '../types/language';

export default function QuickAccess({ language }: { language: Language }) {
  
  const texts = {
    title: {
      ru: 'Быстрый доступ',
      kk: 'Жылдам қол жеткізу',
      en: 'Quick Access'
    },
    portalBtn: {
      title: { ru: 'Margulan University', kk: 'Margulan University', en: 'Margulan University' },
      desc: { ru: 'Подача заявки на мобильность', kk: 'Мобильділікке өтінім беру', en: 'Apply for mobility' }
    },
    infoBtn: {
      title: { ru: 'Toraighyrov University', kk: 'Toraighyrov University', en: 'Toraighyrov University' },
      desc: { ru: 'Подача заявки на мобильность', kk: 'Мобильділікке өтінім беру', en: 'Apply for mobility' }
    }
  };

  return (
    // ИСПРАВЛЕНО: Убрал -mt-16, добавил нормальные отступы py-10
    // Теперь это отдельная полоса на сером фоне
    <section className="relative z-20 bg-gray-50 py-10 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Заголовок секции (опционально, можно убрать если не нравится) */}
        <div className="text-center mb-6 md:hidden">
            <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">{texts.title[language]}</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          
          {/* Кнопка 1: Global PPU */}
          <motion.a
            href="https://global.ppu.edu.kz/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-uni-primary/30 transition-all group cursor-pointer"
          >
            {/* Иконка с фоном */}
            <div className="bg-uni-primary/10 p-3 rounded-lg group-hover:bg-uni-primary text-uni-primary group-hover:text-white transition-colors">
              <MousePointerClick className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 group-hover:text-uni-primary transition-colors">
                {texts.portalBtn.title[language]}
              </h3>
              <p className="text-sm text-gray-500">
                {texts.portalBtn.desc[language]}
              </p>
            </div>
            
            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-uni-primary transition-colors" />
          </motion.a>

          {/* Кнопка 2: TOU Info */}
          <motion.a
            href="https://tou.edu.kz/ru/2011-09-15-10-55-55"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-uni-secondary/30 transition-all group cursor-pointer"
          >
            {/* Иконка с фоном */}
            <div className="bg-uni-secondary/10 p-3 rounded-lg group-hover:bg-uni-secondary text-uni-secondary group-hover:text-white transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 group-hover:text-uni-secondary transition-colors">
                {texts.infoBtn.title[language]}
              </h3>
              <p className="text-sm text-gray-500">
                {texts.infoBtn.desc[language]}
              </p>
            </div>

            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-uni-secondary transition-colors" />
          </motion.a>

        </div>
      </div>
    </section>
  );
}