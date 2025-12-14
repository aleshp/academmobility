import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, RefreshCw, AlertCircle } from 'lucide-react';

// --- ТИПЫ ---
type ScaleType = 'A' | 'I' | 'R' | 'P' | 'E';

interface Question {
  id: number;
  text: string;
  scale: ScaleType;
  target: boolean; // true = '+', false = '-'
}

// --- ДАННЫЕ (99 Вопросов + Ключи из методики) ---
// Я сопоставил вопросы с ключами из твоего текста.
// target: true (ответ "Да" дает балл), target: false (ответ "Нет" дает балл)

const QUESTIONS: Question[] = [
  // Информированность (И) +
  { id: 1, text: 'Я отношусь к тем людям, которые выбирают не конкретную профессию, а уровень образования.', scale: 'I', target: true },
  // Принятие решений (Р) +
  { id: 2, text: 'Я не принимаю серьёзных решений мгновенно.', scale: 'R', target: true },
  { id: 3, text: 'Когда мне нужно решиться на какое-то важное дело, я самым серьёзным образом оцениваю свои способности.', scale: 'R', target: true },
  // Информированность (И) +
  { id: 4, text: 'Я знаю, в каких условиях я буду работать.', scale: 'I', target: true },
  // Планирование (П) +
  { id: 5, text: 'Я анализирую своё прошлое.', scale: 'P', target: true },
  // Эмоции (Э) -
  { id: 6, text: 'Я тяжело переношу неудачи в жизни.', scale: 'E', target: false },
  // Информированность (И) +
  { id: 7, text: 'Я знаю обязанности, которые я буду выполнять на работе.', scale: 'I', target: true },
  // Автономность (А) +
  { id: 8, text: 'Меня обязательно будут уважать за мои знания и опыт.', scale: 'A', target: true },
  // Планирование (П) +
  { id: 9, text: 'Я ищу в прошлом истоки того, что со мной происходит в настоящем.', scale: 'P', target: true },
  // Эмоции (Э) -
  { id: 10, text: 'Мне не нравится, что поиск дела по душе требует больших усилий.', scale: 'E', target: false },
  // Принятие решений (Р) +
  { id: 11, text: 'Все мои действия подчинены определённым целям.', scale: 'R', target: true },
  // Планирование (П) +
  { id: 12, text: 'У меня вошло в привычку думать о том, что со мной происходило раньше.', scale: 'P', target: true },
  // Информированность (И) -
  { id: 13, text: 'По моему мнению, знание будущей работы до мельчайших подробностей не гарантирует от разочарований.', scale: 'I', target: false },
  // Автономность (А) +
  { id: 14, text: 'Я приложу все усилия, чтобы иметь высокие знания и навыки хотя бы в одной области.', scale: 'A', target: true },
  // Планирование (П) +
  { id: 15, text: 'У меня стало привычкой анализировать важные события моей жизни.', scale: 'P', target: true },
  // Принятие решений (Р) +
  { id: 16, text: 'Я ничего не делаю без причины.', scale: 'R', target: true },
  // Эмоции (Э) -
  { id: 17, text: 'Меня вполне устраивает моя пассивность.', scale: 'E', target: false },
  // Планирование (П) +
  { id: 18, text: 'Я задумываюсь о том, что меня ждёт в будущем.', scale: 'P', target: true },
  // Автономность (А) -
  { id: 19, text: 'Я предпочитаю спокойную, малоответственную работу.', scale: 'A', target: false },
  // Принятие решений (Р) -
  { id: 20, text: 'Я отношусь к тем людям, которые поступают необдуманно.', scale: 'R', target: false },
  // Информированность (И) +
  { id: 21, text: 'Я буду менять места работы до тех пор, пока не найду то, что мне нужно.', scale: 'I', target: true },
  // Эмоции (Э) -
  { id: 22, text: 'Первая же крупная неудача может «выбить меня из седла».', scale: 'E', target: false },
  // Планирование (П) -
  { id: 23, text: 'Я не задумываюсь о своём будущем.', scale: 'P', target: false },
  // Автономность (А) -
  { id: 24, text: 'Я не выберу работу, требующую большой отдачи.', scale: 'A', target: false },
  // Принятие решений (Р) +
  { id: 25, text: 'Я знаю самого себя.', scale: 'R', target: true },
  // Эмоции (Э) +
  { id: 26, text: 'Я буду добиваться своего, даже если это вызовет недовольство родных и близких.', scale: 'E', target: true },
  // Информированность (И) +
  { id: 27, text: 'Чем больше профессий я знаю, тем легче мне будет выбирать.', scale: 'I', target: true },
  // Эмоции (Э) -
  { id: 28, text: 'Мне не нравится быть самостоятельным.', scale: 'E', target: false },
  // Планирование (П) -
  { id: 29, text: 'Я не собираюсь заранее планировать уровень образования, который я хотел бы получить.', scale: 'P', target: false },
  // Автономность (А) -
  { id: 30, text: 'Меня страшат ситуации, в которых я должен сам принимать решения.', scale: 'A', target: false },
  // Принятие решений (Р) +
  { id: 31, text: 'Я не жалею времени на обдумывание вариантов сложных математических задач.', scale: 'R', target: true },
  // Эмоции (Э) -
  { id: 32, text: 'Когда меня постигают неудачи, я начинаю думать, что ни на что не способен.', scale: 'E', target: false },
  // Эмоции (Э) -
  { id: 33, text: 'Я не представляю себя работником, решающим производственные и личные проблемы.', scale: 'E', target: false },
  // Автономность (А) -
  { id: 34, text: 'Я вряд ли смог бы выполнить производственные задания без помощи руководителя.', scale: 'A', target: false },
  // Информированность (И) -
  { id: 35, text: 'Мне трудно узнать о перспективах, которые даёт та или иная профессия.', scale: 'I', target: false },
  // Принятие решений (Р) +
  { id: 36, text: 'Я считаю, что интуиция основана на знании.', scale: 'R', target: true },
  // Информированность (И) -
  { id: 37, text: 'Чтение справочников о профессиях ничего мне не даёт.', scale: 'I', target: false },
  // Планирование (П) -
  { id: 38, text: 'У меня нет устойчивых взглядов на моё профессиональное будущее.', scale: 'P', target: false },
  // Эмоции (Э) -
  { id: 39, text: 'В моей жизни мало успехов.', scale: 'E', target: false },
  // Информированность (И) +
  { id: 40, text: 'Я стремлюсь целенаправленно узнавать о профессиях, учебных заведениях и местах работы.', scale: 'I', target: true },
  // Эмоции (Э) -
  { id: 41, text: 'Я очень беспокоюсь, смогу ли я справиться с трудностями в своей профессиональной жизни.', scale: 'E', target: false },
  // Принятие решений (Р) +
  { id: 42, text: 'Я признаю только обдуманный риск.', scale: 'R', target: true },
  // Эмоции (Э) -
  { id: 43, text: 'Многие мои планы срываются из-за моей неуверенности в себе.', scale: 'E', target: false },
  // Планирование (П) -
  { id: 44, text: 'Я отношусь к тем людям, которые живут настоящим.', scale: 'P', target: false },
  // Автономность (А) +
  { id: 45, text: 'Я с детства привык доводить начатое до конца.', scale: 'A', target: true },
  // Эмоции (Э) -
  { id: 46, text: 'Я боюсь делать важные шаги в своей жизни.', scale: 'E', target: false },
  // Принятие решений (Р) +
  { id: 47, text: 'Я знаю, что мне интересно.', scale: 'R', target: true },
  // Информированность (И) +
  { id: 48, text: 'Было время, когда я строил образ «идеальной профессии» без конкретного названия.', scale: 'I', target: true },
  // Эмоции (Э) -
  { id: 49, text: 'Когда я иду на компромисс, у меня портится настроение.', scale: 'E', target: false },
  // Автономность (А) +
  { id: 50, text: 'Я готов приложить много усилий, чтобы добиться того, что мне нужно.', scale: 'A', target: true },
  // Принятие решений (Р) +
  { id: 51, text: 'Я знаю, чего я добьюсь в жизни.', scale: 'R', target: true },
  // Планирование (П) +
  { id: 52, text: 'Я могу назвать профессии, которые интересовали меня в детстве.', scale: 'P', target: true },
  // Автономность (А) -
  { id: 53, text: 'Я мало задумываюсь о своей жизни.', scale: 'A', target: false },
  // Эмоции (Э) -
  { id: 54, text: 'Я не могу определить своего отношения к тому, что мне необходимо принимать решения.', scale: 'E', target: false },
  // Эмоции (Э) -
  { id: 55, text: 'В оценке профессий эмоции для меня играют большую роль.', scale: 'E', target: false },
  // Принятие решений (Р) +
  { id: 56, text: 'Если я чего-то очень захочу, я преодолею любые препятствия.', scale: 'R', target: true },
  // Автономность (А) -
  { id: 57, text: 'У меня нет определённых требований к будущему.', scale: 'A', target: false },
  // Принятие решений (Р) -
  { id: 58, text: 'При принятии решений я полагаюсь на интуицию.', scale: 'R', target: false },
  // Эмоции (Э) -
  { id: 59, text: 'Мне не нравится, когда от меня требуют инициативы и активности.', scale: 'E', target: false },
  // Планирование (П) +
  { id: 60, text: 'Я знаю, что у меня есть такие черты характера, которые совершенно необходимы для моей профессии.', scale: 'P', target: true },
  // Автономность (А) -
  { id: 61, text: 'Я – соломинка, влекомая течением жизни.', scale: 'A', target: false },
  // Эмоции (Э) -
  { id: 62, text: 'Когда я думаю о том, что мне нужно выбирать профессию, у меня портится настроение.', scale: 'E', target: false },
  // Принятие решений (Р) -
  { id: 63, text: 'При выборе я полагаюсь на то, что внешне более привлекательно.', scale: 'R', target: false },
  // Планирование (П) +
  { id: 64, text: 'Своим поведением в настоящем я строю фундамент для будущего.', scale: 'P', target: true },
  // Автономность (А) -
  { id: 65, text: 'Если что-то помешает мне получит выбранную профессию, я легко поменяю её на другую.', scale: 'A', target: false },
  // Информированность (И) -
  { id: 66, text: 'Я никогда не задумываюсь, по каким законам устроен мир профессий.', scale: 'I', target: false },
  // Принятие решений (Р) +
  { id: 67, text: 'Я считаю, что люди, которые много достигли в жизни, знали, почему они поступали так, а не иначе.', scale: 'R', target: true },
  // Информированность (И) +
  { id: 68, text: 'Практическая работа очень помогла мне в понимании мира профессий.', scale: 'I', target: true },
  // Эмоции (Э) -
  { id: 69, text: 'Я с трудом уживаюсь с другими людьми.', scale: 'E', target: false },
  // Планирование (П) +
  { id: 70, text: 'Я сознательно стремлюсь к достижению намеченных целей.', scale: 'P', target: true },
  // Автономность (А) -
  { id: 71, text: 'Любой совет, данный мне со стороны, может поколебать мой выбор профессии.', scale: 'A', target: false },
  // Принятие решений (Р) +
  { id: 72, text: 'Я знаю, что для меня в жизни важно.', scale: 'R', target: true },
  // Информированность (И) -
  { id: 73, text: 'Я не доверяю тому, что написано в книгах о профессиях.', scale: 'I', target: false },
  // Планирование (П) +
  { id: 74, text: 'Я планирую свою жизнь хотя бы на неделю вперёд.', scale: 'P', target: true },
  // Автономность (А) -
  { id: 75, text: 'Я знаю, почему я выбрал именно эту профессию.', scale: 'A', target: false }, // Прим: В ключе указан "-" для №75.
  // Информированность (И) -
  { id: 76, text: 'Лучший способ познакомиться с профессией – поговорить с тем, кто по ней работает.', scale: 'I', target: false }, // Прим: В ключе "-"
  // Эмоции (Э) -
  { id: 77, text: 'Мне не нравится, когда много думают о будущем.', scale: 'E', target: false },
  // Автономность (А) -
  { id: 78, text: 'В учебном заведении я получу все необходимые знания и больше никогда учиться не буду.', scale: 'A', target: false },
  // Принятие решений (Р) +
  { id: 79, text: 'Я знаю область, в которой я добьюсь больших успехов, чем в других.', scale: 'R', target: true },
  // Информированность (И) -
  { id: 80, text: 'Заранее известных способов изучения мира профессий не существует.', scale: 'I', target: false },
  // Эмоции (Э) -
  { id: 81, text: 'Мне не нравится, когда много рассуждают о том, кем быть.', scale: 'E', target: false },
  // Планирование (П) -
  { id: 82, text: 'Мне трудно спланировать свою жизнь даже на неделю вперёд.', scale: 'P', target: false },
  // Автономность (А) -
  { id: 83, text: 'Я считаю, что в обществе все равны по своему положению.', scale: 'A', target: false },
  // Информированность (И) -
  { id: 84, text: 'Большинство сведений о профессиях я воспринимаю как ненужные.', scale: 'I', target: false },
  // Планирование (П) -
  { id: 85, text: 'Фактически я выбрал учебное заведение, не думая, где я буду работать после его окончания.', scale: 'P', target: false },
  // Автономность (А) -
  { id: 86, text: 'Мне всё равно, будут ли уважать меня на работе как профессионала.', scale: 'A', target: false },
  // Принятие решений (Р) +
  { id: 87, text: 'В своих поступках я всегда опираюсь на проверенные сведения.', scale: 'R', target: true },
  // Планирование (П) -
  { id: 88, text: 'Всё, что со мной происходит, - дело случая.', scale: 'P', target: false },
  // Эмоции (Э) -
  { id: 89, text: 'Мне не хочется брать на себя ответственность за выбор профессии.', scale: 'E', target: false },
  // Принятие решений (Р) +
  { id: 90, text: 'В важных решениях я не иду на компромиссы.', scale: 'R', target: true },
  // Информированность (И) -
  { id: 91, text: 'Я не доверяю рекламе профессий.', scale: 'I', target: false },
  // Автономность (А) -
  { id: 92, text: 'Я не понимаю причин многих моих поступков.', scale: 'A', target: false },
  // Принятие решений (Р) +
  { id: 93, text: 'Мои самооценки совпадают с тем, как оценивают меня друзья.', scale: 'R', target: true },
  // Автономность (А) -
  { id: 94, text: 'Я не понимаю самого себя.', scale: 'A', target: false },
  // Эмоции (Э) -
  { id: 95, text: 'Я начинаю нервничать, когда задумываюсь о том, что меня ожидает.', scale: 'E', target: false },
  // Автономность (А) -
  { id: 96, text: 'Мой опыт показывает, что от анализа своих мыслей и переживаний пользы мало.', scale: 'A', target: false },
  // Планирование (П) -
  { id: 97, text: 'Я не знаю, как осуществить свой профессиональный выбор.', scale: 'P', target: false },
  // Планирование (П) +
  { id: 98, text: 'Я могу отказаться от многого, сейчас ценного для меня, ради перспективных профессиональных целей.', scale: 'P', target: true },
  // Планирование (П) +
  { id: 99, text: 'Я представляю, каким я буду через 10 лет.', scale: 'P', target: true },
];

const SCALES_INFO = {
  A: {
    title: 'Автономность (А)',
    desc: 'Способность к самоопределению, независимость от родителей, инициатива, ответственность за свои поступки и стремление к успеху.'
  },
  I: {
    title: 'Информированность (И)',
    desc: 'Знание о мире профессий, условиях труда, требованиях к образованию и умение соотносить эту информацию со своими возможностями.'
  },
  R: {
    title: 'Принятие решений (Р)',
    desc: 'Умение собирать информацию, оценивать альтернативы, просчитывать риски и брать ответственность за последствия своего выбора.'
  },
  P: {
    title: 'Планирование (П)',
    desc: 'Способность видеть перспективу, ставить цели, моделировать свое будущее и разрабатывать стратегии достижения успеха.'
  },
  E: {
    title: 'Эмоциональное отношение (Э)',
    desc: 'Эмоциональная включенность, оптимизм, устойчивость к неудачам. Низкий балл может говорить о страхе перед ответственностью.'
  }
};

export default function ReadinessTest() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(QUESTIONS.length / itemsPerPage);
  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  const handleAnswer = (id: number, value: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const calculateResults = () => {
    const scores = { A: 0, I: 0, R: 0, P: 0, E: 0 };
    
    QUESTIONS.forEach(q => {
      // Если пользователь ответил так же, как в ключе (target), то +1 балл
      // Если userValue === target, значит совпало
      if (answers[q.id] === q.target) {
        scores[q.scale]++;
      }
    });

    return scores;
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      // Скролл вверх при смене страницы
      document.getElementById('readiness-card')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowResult(true);
      document.getElementById('psychology')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const resetTest = () => {
    setAnswers({});
    setCurrentPage(0);
    setShowResult(false);
  };

  // --- RENDERING RESULTS ---
  if (showResult) {
    const scores = calculateResults();
    // Максимальные баллы по шкалам (примерно) для расчета %
    const maxScores = { A: 20, I: 17, R: 20, P: 20, E: 22 }; 

    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Результаты диагностики</h3>
          <p className="text-gray-500">Ваш профиль профессиональной готовности</p>
        </div>

        <div className="space-y-6">
          {(Object.keys(scores) as ScaleType[]).map((scaleKey) => {
            const score = scores[scaleKey];
            const max = maxScores[scaleKey as keyof typeof maxScores] || 20;
            const percent = Math.min(100, Math.round((score / max) * 100));
            
            // Цвет бара в зависимости от результата
            let colorClass = "bg-yellow-500";
            if (percent > 70) colorClass = "bg-green-500";
            if (percent < 40) colorClass = "bg-red-400";

            return (
              <div key={scaleKey} className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="font-bold text-lg text-gray-800">{SCALES_INFO[scaleKey].title}</h4>
                  <span className="font-mono font-bold text-uni-primary">{score} / {max}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${colorClass}`}
                  />
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">{SCALES_INFO[scaleKey].desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={resetTest}
            className="flex items-center gap-2 text-uni-secondary hover:text-uni-primary font-bold transition"
          >
            <RefreshCw className="w-4 h-4" /> Пройти заново
          </button>
        </div>
      </div>
    );
  }

  // --- RENDERING QUESTIONS ---
  const currentQuestions = QUESTIONS.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const isPageComplete = currentQuestions.every(q => answers[q.id] !== undefined);

  return (
    <div id="readiness-card" className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200 mt-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-uni-primary mb-2">Методика «Профессиональная готовность»</h3>
        <p className="text-sm text-gray-500 mb-4">
          Прочитайте утверждения. Согласны ли вы с ними? Ответьте на все 99 вопросов для получения точного результата.
        </p>
        
        {/* Global Progress */}
        <div className="flex items-center gap-3 text-xs font-bold text-gray-400 mb-1">
          <span>Прогресс: {Math.round(progress)}%</span>
          <span className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-uni-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </span>
          <span>{Object.keys(answers).length} / {QUESTIONS.length}</span>
        </div>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {currentQuestions.map((q) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-lg border transition-colors ${answers[q.id] !== undefined ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-100'}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-gray-800 text-sm md:text-base flex-1">
                <span className="font-bold text-gray-400 mr-2">{q.id}.</span>
                {q.text}
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleAnswer(q.id, true)}
                  className={`px-6 py-2 rounded font-bold text-sm transition-all ${
                    answers[q.id] === true 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Да (+)
                </button>
                <button
                  onClick={() => handleAnswer(q.id, false)}
                  className={`px-6 py-2 rounded font-bold text-sm transition-all ${
                    answers[q.id] === false 
                      ? 'bg-red-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Нет (-)
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-uni-primary disabled:opacity-30 disabled:cursor-not-allowed font-medium"
        >
          <ChevronLeft className="w-5 h-5" /> Назад
        </button>

        <span className="text-sm font-bold text-gray-400">
          Страница {currentPage + 1} из {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={!isPageComplete}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all shadow-md ${
            !isPageComplete 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-uni-secondary hover:bg-uni-primary'
          }`}
        >
          {currentPage === totalPages - 1 ? (
            <>Завершить <Check className="w-5 h-5" /></>
          ) : (
            <>Далее <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
      
      {!isPageComplete && (
        <div className="text-center mt-2 text-xs text-red-400 flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3" /> Ответьте на все вопросы, чтобы продолжить
        </div>
      )}
    </div>
  );
}