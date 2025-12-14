import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, HelpCircle, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Language } from '../types/language';

// --- ДАННЫЕ ТЕСТА (Reading Passage) ---
const READING_PASSAGE = {
  title: "The Future of Academic Mobility",
  text: `
    <p class="mb-4"><strong>Paragraph A</strong></p>
    <p class="mb-4">International student mobility has become a defining feature of the modern higher education landscape. Over the past three decades, the number of students enrolled in tertiary education outside their country of citizenship has skyrocketed, rising from 0.8 million in 1975 to over 6 million today. This surge is driven by a combination of factors, including the globalization of economies, the desire for intercultural experiences, and government policies aimed at attracting foreign talent.</p>
    
    <p class="mb-4"><strong>Paragraph B</strong></p>
    <p class="mb-4">However, the landscape is shifting. While traditional destinations like the US and UK remain popular, new regional hubs are emerging in Asia and the Middle East. Furthermore, "virtual mobility" – facilitated by digital technologies – is gaining traction as a sustainable alternative to physical travel. This hybrid model allows students to collaborate with peers globally without the financial and environmental costs associated with long-haul flights.</p>

    <p class="mb-4"><strong>Paragraph C</strong></p>
    <p class="mb-4">Critics argue that academic mobility can exacerbate "brain drain" in developing nations, where the brightest minds emigrate and rarely return. Conversely, proponents suggest the concept of "brain circulation," where skilled expatriates return home with new expertise and networks, ultimately benefiting their countries of origin. The challenge for universities is to create balanced exchange programs that foster mutual growth rather than one-sided talent extraction.</p>
  `
};

const QUESTIONS = [
  {
    id: 1,
    type: 'multiple_choice',
    question: "According to Paragraph A, what is a key driver of the increase in international students?",
    options: [
      "A. The decline of local universities.",
      "B. Government policies and globalization.",
      "C. The reduction of travel costs.",
      "D. Strict visa regulations."
    ],
    correct: "B"
  },
  {
    id: 2,
    type: 'true_false',
    question: "Virtual mobility is considered a more environmentally friendly option than physical travel.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    correct: "TRUE"
  },
  {
    id: 3,
    type: 'multiple_choice',
    question: "What is meant by the term 'brain circulation' in Paragraph C?",
    options: [
      "A. Students moving constantly between countries.",
      "B. The permanent loss of talent from developing nations.",
      "C. Skilled professionals returning home with new skills.",
      "D. The exchange of academic journals."
    ],
    correct: "C"
  },
  {
    id: 4,
    type: 'true_false',
    question: "The number of international students has remained stable since 1975.",
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    correct: "FALSE"
  },
  {
    id: 5,
    type: 'multiple_choice',
    question: "Which region is mentioned as an emerging hub for international students?",
    options: [
      "A. South America",
      "B. Asia",
      "C. Eastern Europe",
      "D. Antarctica"
    ],
    correct: "B"
  }
];

export default function MockTestSection({ language }: { language: Language }) {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes for mini test
  
  // Timer Logic
  useEffect(() => {
    let timer: number;
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: string) => {
    // IELTS options usually A, B, C or TRUE/FALSE. Extract value.
    const value = option.split('.')[0].trim(); 
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentQuestion].id]: value }));
  };

  const finishTest = () => {
    setIsFinished(true);
  };

  const restartTest = () => {
    setIsStarted(false);
    setIsFinished(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(600);
  };

  const calculateScore = () => {
    let correct = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });
    // Rough Band Calculation for 5 questions
    if (correct === 5) return "9.0";
    if (correct === 4) return "7.5";
    if (correct === 3) return "6.0";
    if (correct === 2) return "5.0";
    return "4.0";
  };

  // --- RENDERS ---

  // 1. Start Screen
  if (!isStarted) {
    return (
      <section id="mock-test" className="py-24 bg-uni-gray">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-uni-primary p-8 text-center">
              <h2 className="text-3xl font-serif font-bold text-white mb-2">IELTS Reading Simulation</h2>
              <p className="text-red-100">Mini-Mock Test (Academic Module)</p>
            </div>
            <div className="p-10 text-center">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-10 h-10 text-uni-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Are you ready?</h3>
              <ul className="text-left max-w-md mx-auto space-y-3 text-gray-600 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Real computer-delivered interface style</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> 5 Questions (Mini version)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> 10 Minutes Time Limit</li>
              </ul>
              <button 
                onClick={() => setIsStarted(true)}
                className="bg-uni-primary hover:bg-red-800 text-white px-10 py-4 rounded font-bold text-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Practice Test
              </button>
              <p className="mt-4 text-xs text-gray-400">This is a simulation for practice purposes only.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. Results Screen
  if (isFinished) {
    const score = calculateScore();
    const correctCount = Object.keys(answers).filter(k => answers[Number(k)] === QUESTIONS.find(q => q.id === Number(k))?.correct).length;

    return (
      <section id="mock-test" className="py-24 bg-uni-gray">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 text-center"
          >
            <div className="bg-uni-secondary p-8">
              <h2 className="text-2xl font-serif font-bold text-white">Test Results</h2>
            </div>
            <div className="p-10">
              <div className="mb-6">
                <span className="text-gray-500 uppercase tracking-widest text-sm">Estimated Band Score</span>
                <div className="text-8xl font-bold text-uni-primary mt-2">{score}</div>
              </div>
              <p className="text-xl text-gray-800 mb-8">
                You got <span className="font-bold">{correctCount}</span> out of <span className="font-bold">{QUESTIONS.length}</span> correct.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left max-w-lg mx-auto border border-gray-200">
                <h4 className="font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">Review:</h4>
                <ul className="space-y-2 text-sm">
                  {QUESTIONS.map((q, i) => {
                    const isCorrect = answers[q.id] === q.correct;
                    return (
                      <li key={i} className="flex justify-between items-center">
                        <span className="text-gray-600">Question {i + 1}</span>
                        <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                          {isCorrect ? 'Correct' : `Wrong (Correct: ${q.correct})`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button 
                onClick={restartTest}
                className="flex items-center gap-2 mx-auto text-uni-secondary font-bold hover:text-uni-primary transition"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // 3. Test Interface (IELTS Computer Style)
  return (
    <section id="mock-test" className="h-screen bg-gray-100 flex flex-col fixed inset-0 z-[60]">
      {/* Top Bar */}
      <div className="bg-white h-16 border-b border-gray-300 flex items-center justify-between px-6 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-gray-800">IELTS Reading</div>
          <div className="bg-uni-gray px-3 py-1 rounded text-sm text-gray-600 hidden md:block">Academic Mobility Center</div>
        </div>
        <div className="flex items-center gap-6">
          <div className={`text-xl font-mono font-bold flex items-center gap-2 ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-uni-primary'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
          <button className="text-gray-400 hover:text-uni-secondary flex items-center gap-1 text-sm font-bold">
            <HelpCircle className="w-4 h-4" /> Help
          </button>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Passage */}
        <div className="w-1/2 p-8 overflow-y-auto border-r border-gray-300 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{READING_PASSAGE.title}</h2>
          <div 
            className="prose prose-lg text-gray-700 max-w-none font-serif leading-relaxed"
            dangerouslySetInnerHTML={{ __html: READING_PASSAGE.text }}
          />
        </div>

        {/* Right Side: Questions */}
        <div className="w-1/2 p-8 overflow-y-auto bg-gray-50">
          <div className="max-w-xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
            </div>

            <AnimatePresence mode='wait'>
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 leading-relaxed">
                    {QUESTIONS[currentQuestion].question}
                  </h3>
                  <div className="space-y-3">
                    {QUESTIONS[currentQuestion].options.map((option, idx) => {
                      const val = option.split('.')[0].trim();
                      const isSelected = answers[QUESTIONS[currentQuestion].id] === val;
                      
                      return (
                        <label 
                          key={idx} 
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-uni-primary/5 border-uni-primary' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`q-${currentQuestion}`} 
                            className="w-4 h-4 text-uni-primary focus:ring-uni-primary border-gray-300"
                            checked={isSelected}
                            onChange={() => handleOptionSelect(option)}
                          />
                          <span className={`ml-3 ${isSelected ? 'font-bold text-uni-primary' : 'text-gray-700'}`}>
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Navigation */}
      <div className="bg-white h-20 border-t border-gray-300 px-6 flex items-center justify-between flex-shrink-0">
        
        {/* Question Palette */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {QUESTIONS.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined;
            return (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-10 h-10 rounded text-sm font-bold flex items-center justify-center transition ${
                  currentQuestion === i 
                    ? 'bg-uni-secondary text-white' 
                    : isAnswered 
                      ? 'bg-gray-800 text-white opacity-40' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Nav Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 rounded font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5" /> Prev
          </button>
          
          {currentQuestion === QUESTIONS.length - 1 ? (
            <button 
              onClick={finishTest}
              className="flex items-center gap-2 px-8 py-3 rounded font-bold bg-uni-primary text-white hover:bg-red-800 transition shadow-md"
            >
              Submit Test
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQuestion(prev => Math.min(QUESTIONS.length - 1, prev + 1))}
              className="flex items-center gap-2 px-8 py-3 rounded font-bold bg-uni-secondary text-white hover:bg-gray-800 transition shadow-md"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}