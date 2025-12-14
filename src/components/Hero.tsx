import { motion } from 'framer-motion';
import { Language } from '../types/language';
import { translations } from '../data/translations';
import { ArrowRight, Globe, BookOpen, Users, Compass } from 'lucide-react';
import heroBg from '../assets/images/hero-bg.jpg';

export default function Hero({ language }: { language: Language }) {
  const stats = [
    { number: "50+", label: translations.statPartners[language], icon: BookOpen },
    { number: "15", label: translations.statCountries[language], icon: Globe },
    { number: "200+", label: translations.statStudents[language], icon: Users },
  ];

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col justify-center bg-uni-secondary overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="International Students" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-uni-secondary/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-uni-secondary via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-uni-secondary/90 via-uni-secondary/40 to-transparent" />
      </div>

      {/* CONTENT */}
      {/* -mt-24 поднимает блок вверх относительно центра */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full -mt-24 md:-mt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* БЕЙДЖ УДАЛЕН */}

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-tight tracking-tight">
            {translations.title[language]}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 font-light mb-12 max-w-2xl leading-relaxed border-l-2 border-uni-primary pl-6">
            {translations.subtitle[language]}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Кнопка 1: Программы */}
            <a 
              href="#programs"
              className="bg-uni-primary hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold transition flex items-center justify-center gap-2 group shadow-lg shadow-uni-primary/20"
            >
              {translations.heroBtnPrimary[language]}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            {/* Кнопка 2: Глобальное видение */}
            <a 
              href="#about"
              className="px-8 py-4 rounded-lg font-bold text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5" />
              {translations.heroBtnSecondary[language]}
            </a>
          </div>
        </motion.div>
      </div>

      {/* STATS BAR */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-uni-secondary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-8 md:gap-16">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="hidden md:flex p-3 bg-white/5 rounded-full text-uni-accent">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl md:text-4xl font-serif font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}