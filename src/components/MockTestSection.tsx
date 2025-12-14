import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, HelpCircle, CheckCircle2, Play, Pause, Headphones, BookOpen, PenTool, RefreshCw, AlertTriangle } from 'lucide-react';
import { Language } from '../types/language';

// --- ТИПЫ ДАННЫХ ---
type SectionType = 'menu' | 'listening' | 'reading' | 'writing' | 'results';

// --- КОНТЕНТ ТЕСТОВ (БАЗА ДАННЫХ) ---

const TEST_DATA = {
  listening: {
    title: "Part 1: University Accommodation Enquiry",
    duration: 1800, // 30 minutes
    audioMockLength: 300, // симуляция длины аудио трека
    questions: [
      {
        id: 1,
        type: 'gap_fill',
        question: "Student Name: Sarah ______",
        correct: "Parker"
      },
      {
        id: 2,
        type: 'multiple_choice',
        question: "Preferred location of the dormitory:",
        options: ["A. Near the city center", "B. On campus", "C. Near the sports complex"],
        correct: "B"
      },
      {
        id: 3,
        type: 'gap_fill',
        question: "Maximum monthly budget: $______",
        correct: "600"
      },
      {
        id: 4,
        type: 'multiple_choice',
        question: "Special dietary requirement:",
        options: ["A. Vegetarian", "B. Gluten-free", "C. No specific requirement"],
        correct: "A"
      }
    ]
  },
  reading: {
    title: "The Origins of Coffee Culture",
    duration: 3600, // 60 minutes
    text: `
      <h3 class="font-bold text-xl mb-3">The Origins of Coffee Culture</h3>
      <p class="mb-4"><strong>Paragraph A</strong></p>
      <p class="mb-4">The history of coffee dates back to at least the 15th century, although a number of reports and legends suggest its use much earlier. The earliest substantiated evidence of either coffee drinking or knowledge of the coffee tree appears in the middle of the 15th century in the Sufi shrines of Yemen. It was here in Arabia that coffee seeds were first roasted and brewed in a similar way to how it is now prepared. Coffee was originally used by Sufi monks to stay awake during their nightly prayers.</p>
      
      <p class="mb-4"><strong>Paragraph B</strong></p>
      <p class="mb-4">By the 16th century, coffee had reached the rest of the Middle East, Persia, Turkey, and northern Africa. The first coffee seeds were smuggled out of the Middle East by Sufi Baba Budan from Yemen to India. Before this time, all exported coffee was boiled or otherwise sterilized. Portraits of Baba Budan depict him as having smuggled seven coffee seeds by strapping them to his chest. The first plants grown from these smuggled seeds were planted in Mysore.</p>

      <p class="mb-4"><strong>Paragraph C</strong></p>
      <p class="mb-4">Coffee arrived in Italy in the second half of the 16th century through commercial routes in the Mediterranean. Central European coffee house culture started in Vienna in 1683 after the Battle of Vienna, where bags of coffee beans were left behind by the retreating Ottoman army. From there, it spread to the rest of Europe and eventually to the Americas, becoming one of the most profitable export crops in the world.</p>
    `,
    questions: [
      {
        id: 1,
        type: 'true_false',
        question: "Coffee was first used by Sufi monks to aid in sleep.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correct: "FALSE"
      },
      {
        id: 2,
        type: 'multiple_choice',
        question: "How did Baba Budan smuggle coffee seeds out of the Middle East?",
        options: [
          "A. Hidden in his shoes",
          "B. Strapped to his chest",
          "C. Inside a hollow walking stick",
          "D. Mixed with tea leaves"
        ],
        correct: "B"
      },
      {
        id: 3,
        type: 'true_false',
        question: "The first coffee plants in India were grown in Mysore.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correct: "TRUE"
      },
      {
        id: 4,
        type: 'multiple_choice',
        question: "What event triggered the start of coffee culture in Vienna?",
        options: [
          "A. The arrival of Italian merchants",
          "B. A royal decree",
          "C. The Battle of Vienna",
          "D. The invention of the espresso machine"
        ],
        correct: "C"
      }
    ]
  },
  writing: {
    title: "Writing Task 2: Academic Essay",
    duration: 3600, // 60 minutes
    prompt: `
      <h3 class="font-bold text-lg mb-2">International Education</h3>
      <p class="mb-4">Write about the following topic:</p>
      <div class="bg-gray-100 p-4 border-l-4 border-uni-primary mb-4 italic">
        "Some people believe that studying at a university in a foreign country is the best way to learn about another culture. Others believe that it is better to learn about other cultures through the media and the internet."
      </div>
      <p class="mb-2">Discuss both these views and give your own opinion.</p>
      <p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p>
      <p class="mt-4 font-bold">Write at least 250 words.</p>
    `
  }
};

export default function MockTestSection({ language }: { language: Language }) {
  const [activeSection, setActiveSection] = useState<SectionType>('menu');
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [writingText, setWritingText] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Audio Player State (Simulation)
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Timer Logic
  useEffect(() => {
    let timer: number;
    if (activeSection !== 'menu' && activeSection !== 'results' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        // Simulate audio progress for Listening
        if (activeSection === 'listening' && isPlaying && audioProgress < 100) {
          setAudioProgress(prev => prev + 0.5);
        }
      }, 1000);
    } else if (timeLeft === 0 && activeSection !== 'menu' && activeSection !== 'results') {
      finishSection();
    }
    return () => clearInterval(timer);
  }, [activeSection, timeLeft, isPlaying, audioProgress]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startSection = (section: 'listening' | 'reading' | 'writing') => {
    setActiveSection(section);
    setTimeLeft(TEST_DATA[section].duration);
    setAnswers({});
    setWritingText("");
    setCurrentQuestionIndex(0);
    setAudioProgress(0);
    setIsPlaying(section === 'listening'); // Auto-play for listening
  };

  const finishSection = () => {
    setActiveSection('results');
    setIsPlaying(false);
  };

  const calculateReadingScore = () => {
    let correct = 0;
    TEST_DATA.reading.questions.forEach(q => {
      if (answers[`r-${q.id}`] === q.correct) correct++;
    });
    return { correct, total: TEST_DATA.reading.questions.length };
  };

  const calculateListeningScore = () => {
    let correct = 0;
    TEST_DATA.listening.questions.forEach(q => {
      // Case insensitive check for gap fill
      const userAnswer = answers[`l-${q.id}`]?.toLowerCase().trim();
      const correctAns = q.correct.toLowerCase();
      if (userAnswer === correctAns || (q.type === 'multiple_choice' && answers[`l-${q.id}`] === q.correct)) {
        correct++;
      }
    });
    return { correct, total: TEST_DATA.listening.questions.length };
  };

  const getWordCount = () => {
    return writingText.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  // --- RENDERERS ---

  // 1. MENU SCREEN
  if (activeSection === 'menu') {
    return (
      <section id="mock-test" className="py-24 bg-uni-gray">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">IELTS Mock Test Center</h2>
            <p className="text-gray-600">Выберите секцию для практики. Интерфейс полностью повторяет реальный экзамен.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Listening Card */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Headphones className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Listening</h3>
              <p className="text-gray-500 text-center text-sm mb-6">30 minutes • 4 Parts</p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Native Audio Simulation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Gap Fill & Multiple Choice</li>
              </ul>
              <button onClick={() => startSection('listening')} className="w-full py-3 border-2 border-blue-500 text-blue-600 font-bold rounded hover:bg-blue-50 transition">Start Listening</button>
            </motion.div>

            {/* Reading Card */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-uni-primary">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-8 h-8 text-uni-primary" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Reading</h3>
              <p className="text-gray-500 text-center text-sm mb-6">60 minutes • 3 Passages</p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Split-Screen Interface</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> T/F/NG & Multiple Choice</li>
              </ul>
              <button onClick={() => startSection('reading')} className="w-full py-3 bg-uni-primary text-white font-bold rounded hover:bg-red-800 transition shadow-md">Start Reading</button>
            </motion.div>

            {/* Writing Card */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <PenTool className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Writing</h3>
              <p className="text-gray-500 text-center text-sm mb-6">60 minutes • Task 2</p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Live Word Counter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Official Task UI</li>
              </ul>
              <button onClick={() => startSection('writing')} className="w-full py-3 border-2 border-yellow-500 text-yellow-600 font-bold rounded hover:bg-yellow-50 transition">Start Writing</button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // 2. RESULTS SCREEN
  if (activeSection === 'results') {
    const rScore = calculateReadingScore();
    const lScore = calculateListeningScore();
    // Мы не можем автоматически проверить Writing на фронтенде, поэтому показываем заглушку
    const wWords = getWordCount();

    return (
      <section className="py-24 bg-uni-gray min-h-screen flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-2xl w-full text-center">
          <div className="mb-6 inline-flex p-4 bg-green-100 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Test Completed</h2>
          <p className="text-gray-600 mb-10">Результаты вашей практики были сохранены.</p>

          <div className="grid grid-cols-1 gap-6 mb-10 text-left">
            {/* Results Logic */}
            {Object.keys(answers).some(k => k.startsWith('r-')) && (
              <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                <h3 className="font-bold text-lg text-uni-primary mb-2">Reading</h3>
                <p>Correct: <span className="font-bold">{rScore.correct}</span> / {rScore.total}</p>
              </div>
            )}
            
            {Object.keys(answers).some(k => k.startsWith('l-')) && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-bold text-lg text-blue-600 mb-2">Listening</h3>
                <p>Correct: <span className="font-bold">{lScore.correct}</span> / {lScore.total}</p>
              </div>
            )}

            {writingText.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                <h3 className="font-bold text-lg text-yellow-600 mb-2">Writing</h3>
                <p>Words written: <span className="font-bold">{wWords}</span></p>
                <p className="text-sm text-gray-500 mt-2">Note: Automated grading for Writing is not available in this demo. Please consult with a teacher.</p>
              </div>
            )}
          </div>

          <button onClick={() => setActiveSection('menu')} className="bg-uni-secondary text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition">
            Back to Menu
          </button>
        </div>
      </section>
    );
  }

  // --- COMMON UI FOR TESTS ---
  return (
    <section className="fixed inset-0 z-[60] bg-gray-100 flex flex-col h-screen">
      
      {/* 1. TOP BAR */}
      <div className="bg-white h-16 border-b border-gray-300 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-gray-900 capitalize flex items-center gap-2">
            {activeSection === 'listening' && <Headphones className="w-5 h-5"/>}
            {activeSection === 'reading' && <BookOpen className="w-5 h-5"/>}
            {activeSection === 'writing' && <PenTool className="w-5 h-5"/>}
            IELTS {activeSection}
          </div>
        </div>
        
        {/* LISTENING AUDIO PLAYER SIMULATION */}
        {activeSection === 'listening' && (
          <div className="flex-1 mx-12 flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
            </button>
            <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000 ease-linear" style={{ width: `${audioProgress}%` }} />
            </div>
            <span className="text-xs font-mono text-gray-500">Audio Playing...</span>
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className={`text-xl font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-uni-primary'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
          <button className="text-gray-400 hover:text-uni-secondary text-sm font-bold flex items-center gap-1">
            <HelpCircle className="w-4 h-4" /> Help
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA (SPLIT SCREEN) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDE (Material) */}
        <div className="w-1/2 p-8 overflow-y-auto border-r border-gray-300 bg-white">
          {activeSection === 'reading' && (
             <div className="prose prose-lg text-gray-800 max-w-none" dangerouslySetInnerHTML={{ __html: TEST_DATA.reading.text }} />
          )}
          {activeSection === 'writing' && (
             <div className="prose prose-lg text-gray-800 max-w-none" dangerouslySetInnerHTML={{ __html: TEST_DATA.writing.prompt }} />
          )}
          {activeSection === 'listening' && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Headphones className="w-24 h-24 mb-4 opacity-20" />
                <p>Listen to the audio track and answer the questions on the right.</p>
                <p className="text-sm mt-4 text-blue-500 font-bold animate-pulse">Audio is simulated for this demo.</p>
             </div>
          )}
        </div>

        {/* RIGHT SIDE (Questions/Input) */}
        <div className="w-1/2 p-8 overflow-y-auto bg-gray-50">
          
          {/* WRITING INPUT */}
          {activeSection === 'writing' && (
            <div className="h-full flex flex-col">
              <textarea
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                placeholder="Start typing your essay here..."
                className="flex-1 w-full p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uni-primary focus:border-transparent resize-none font-serif text-lg leading-relaxed"
                spellCheck={false}
              />
              <div className="mt-4 flex justify-between items-center text-gray-600 font-bold">
                <span>Word Count: <span className={getWordCount() >= 250 ? "text-green-600" : "text-red-500"}>{getWordCount()}</span> / 250</span>
              </div>
            </div>
          )}

          {/* READING / LISTENING QUESTIONS */}
          {(activeSection === 'reading' || activeSection === 'listening') && (
            <div className="max-w-xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {TEST_DATA[activeSection].questions.length}
                </span>
              </div>

              {TEST_DATA[activeSection].questions.map((q, idx) => {
                if (idx !== currentQuestionIndex) return null;
                const prefix = activeSection === 'reading' ? 'r-' : 'l-';
                const answerKey = `${prefix}${q.id}`;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-6">{q.question}</h3>
                    
                    {/* Multiple Choice */}
                    {q.type === 'multiple_choice' && q.options && (
                      <div className="space-y-3">
                        {q.options.map((opt, i) => {
                           const val = opt.split('.')[0].trim();
                           return (
                            <label key={i} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${answers[answerKey] === val ? 'bg-uni-primary/5 border-uni-primary' : 'hover:bg-gray-50'}`}>
                              <input 
                                type="radio" 
                                name={`q-${q.id}`} 
                                checked={answers[answerKey] === val}
                                onChange={() => setAnswers(prev => ({...prev, [answerKey]: val}))}
                                className="w-4 h-4 text-uni-primary"
                              />
                              <span className="ml-3 text-gray-700">{opt}</span>
                            </label>
                           );
                        })}
                      </div>
                    )}

                    {/* True/False */}
                    {q.type === 'true_false' && q.options && (
                      <div className="flex gap-4">
                        {q.options.map((opt, i) => (
                           <button 
                            key={i}
                            onClick={() => setAnswers(prev => ({...prev, [answerKey]: opt}))}
                            className={`flex-1 py-3 border rounded font-bold transition ${answers[answerKey] === opt ? 'bg-uni-primary text-white border-uni-primary' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                           >
                             {opt}
                           </button>
                        ))}
                      </div>
                    )}

                    {/* Gap Fill */}
                    {q.type === 'gap_fill' && (
                      <input 
                        type="text"
                        placeholder="Type your answer..."
                        value={answers[answerKey] || ''}
                        onChange={(e) => setAnswers(prev => ({...prev, [answerKey]: e.target.value}))}
                        className="w-full p-4 border border-gray-300 rounded focus:ring-2 focus:ring-uni-primary outline-none font-bold text-lg"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM BAR (NAVIGATION) */}
      <div className="bg-white h-20 border-t border-gray-300 px-6 flex items-center justify-between flex-shrink-0">
        
        {/* Question Palette (Only for R/L) */}
        {(activeSection === 'reading' || activeSection === 'listening') ? (
          <div className="flex gap-2">
            {TEST_DATA[activeSection].questions.map((q, i) => {
              const prefix = activeSection === 'reading' ? 'r-' : 'l-';
              const isAnswered = answers[`${prefix}${q.id}`] !== undefined && answers[`${prefix}${q.id}`] !== '';
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-10 h-10 rounded text-sm font-bold transition ${currentQuestionIndex === i ? 'bg-uni-secondary text-white' : isAnswered ? 'bg-gray-800 text-white opacity-40' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">Writing Task 2</div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {(activeSection === 'reading' || activeSection === 'listening') && (
             <>
               <button 
                 onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                 disabled={currentQuestionIndex === 0}
                 className="px-6 py-3 rounded font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
               >
                 <ChevronLeft className="w-5 h-5 inline mr-1" /> Prev
               </button>
               <button 
                 onClick={() => setCurrentQuestionIndex(prev => Math.min(TEST_DATA[activeSection].questions.length - 1, prev + 1))}
                 disabled={currentQuestionIndex === TEST_DATA[activeSection].questions.length - 1}
                 className="px-6 py-3 rounded font-bold bg-uni-secondary text-white hover:bg-gray-800 disabled:opacity-50 disabled:bg-gray-300"
               >
                 Next <ChevronRight className="w-5 h-5 inline ml-1" />
               </button>
             </>
          )}

          <button 
            onClick={finishSection}
            className="px-8 py-3 rounded font-bold bg-uni-primary text-white hover:bg-red-800 shadow-md ml-4"
          >
            Submit Section
          </button>
        </div>
      </div>
    </section>
  );
}