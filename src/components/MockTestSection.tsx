import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Clock, CheckCircle2, Play, Pause, Headphones, BookOpen, PenTool, Loader2, AlertCircle } from 'lucide-react';
import { Language } from '../types/language';

// --- ТИПЫ ДАННЫХ ---
type SectionType = 'menu' | 'listening' | 'reading' | 'writing' | 'results';

// --- КОНТЕНТ ТЕСТОВ ---
const TEST_DATA = {
  listening: {
    title: "Part 1: University Accommodation Enquiry",
    duration: 1800,
    questions: [
      { id: 1, type: 'gap_fill', question: "Student Name: Sarah ______", correct: "Parker" },
      { id: 2, type: 'multiple_choice', question: "Preferred location:", options: ["A. City center", "B. On campus", "C. Sports complex"], correct: "B" },
      { id: 3, type: 'gap_fill', question: "Max monthly budget: $______", correct: "600" },
      { id: 4, type: 'multiple_choice', question: "Dietary requirement:", options: ["A. Vegetarian", "B. Gluten-free", "C. None"], correct: "A" }
    ]
  },
  reading: {
    title: "The Origins of Coffee Culture",
    duration: 3600,
    text: `
      <h3 class="font-bold text-xl mb-3">The Origins of Coffee Culture</h3>
      <p class="mb-4"><strong>Paragraph A</strong></p>
      <p class="mb-4">The history of coffee dates back to at least the 15th century... (Truncated for brevity, full text implied)</p>
      <p class="mb-4">The earliest substantiated evidence of either coffee drinking or knowledge of the coffee tree appears in the middle of the 15th century in the Sufi shrines of Yemen.</p>
      <p class="mb-4"><strong>Paragraph B</strong></p>
      <p class="mb-4">By the 16th century, coffee had reached the rest of the Middle East. The first coffee seeds were smuggled out by Sufi Baba Budan from Yemen to India.</p>
      <p class="mb-4"><strong>Paragraph C</strong></p>
      <p class="mb-4">Central European coffee house culture started in Vienna in 1683 after the Battle of Vienna.</p>
    `,
    questions: [
      { id: 1, type: 'true_false', question: "Coffee was first used by Sufi monks to aid in sleep.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: "FALSE" },
      { id: 2, type: 'multiple_choice', question: "How were seeds smuggled?", options: ["A. Shoes", "B. Strapped to chest", "C. Cane", "D. Tea"], correct: "B" },
      { id: 3, type: 'true_false', question: "First plants in India grew in Mysore.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: "TRUE" },
      { id: 4, type: 'multiple_choice', question: "What started Vienna coffee culture?", options: ["A. Merchants", "B. Decree", "C. Battle of Vienna", "D. Espresso"], correct: "C" }
    ]
  },
  writing: {
    title: "Writing Task 2: Academic Essay",
    duration: 3600,
    prompt: `
      <h3 class="font-bold text-lg mb-2">International Education</h3>
      <div class="bg-gray-100 p-4 border-l-4 border-uni-primary mb-4 italic">
        "Some people believe that studying at a university in a foreign country is the best way to learn about another culture. Others believe that it is better to learn about other cultures through the media and the internet."
      </div>
      <p class="mb-2">Discuss both these views and give your own opinion.</p>
    `
  }
};

export default function MockTestSection({ language }: { language: Language }) {
  const [activeSection, setActiveSection] = useState<SectionType>('menu');
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [writingText, setWritingText] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Grading State
  const [isGrading, setIsGrading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Timer
  useEffect(() => {
    let timer: number;
    if (activeSection !== 'menu' && activeSection !== 'results' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (activeSection === 'listening' && isPlaying && audioProgress < 100) setAudioProgress(prev => prev + 0.5);
      }, 1000);
    } else if (timeLeft === 0 && activeSection !== 'menu' && activeSection !== 'results') {
      finishSection();
    }
    return () => clearInterval(timer);
  }, [activeSection, timeLeft, isPlaying, audioProgress]);

  // AUTO-GRADING TRIGGER
  useEffect(() => {
    if (activeSection === 'results' && writingText.length > 50 && !aiFeedback && !isGrading) {
      handleAiGrading();
    }
  }, [activeSection, writingText]);

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
    setAiFeedback(null);
    setCurrentQuestionIndex(0);
    setAudioProgress(0);
    setIsPlaying(section === 'listening');
  };

  const finishSection = () => {
    setActiveSection('results');
    setIsPlaying(false);
  };

  // --- SAFE GRADING FUNCTION ---
  const handleAiGrading = async () => {
    setIsGrading(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        ACT AS AN OFFICIAL IELTS EXAMINER.
        TASK: Evaluate the following IELTS Writing Task 2 essay based on official criteria.
        PROMPT TOPIC: "Some people believe that studying at a university in a foreign country is the best way to learn about another culture. Others believe that it is better to learn about other cultures through the media and the internet. Discuss both views and give your own opinion."
        STUDENT'S ESSAY: "${writingText}"
        OUTPUT FORMAT (HTML):
        <div style="font-family: serif; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
            <h2 style="color: #8B1E28; margin:0;">Official Band Score: [SCORE]</h2>
        </div>
        <p><b>Examiner's Report:</b></p>
        <ul>
           <li><b>Task Response:</b> [Strict feedback]</li>
           <li><b>Coherence & Cohesion:</b> [Strict feedback]</li>
           <li><b>Lexical Resource:</b> [Strict feedback]</li>
           <li><b>Grammatical Range:</b> [Strict feedback]</li>
        </ul>
        <p><b>Recommendations for improvement:</b></p>
        [List 2 specific formal recommendations]
        Do not mention you are an AI. Act as a human examiner system.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      setAiFeedback(response.text());
    } catch (error) {
      console.error("Grading Error:", error);
      setAiFeedback("<p style='color:red'>System is currently busy or API key is missing. Assessment could not be completed.</p>");
    } finally {
      setIsGrading(false);
    }
  };

  const getWordCount = () => writingText.trim().split(/\s+/).filter(w => w.length > 0).length;

  // --- SAFE SCORE CALCULATORS ---
  const calculateReadingScore = () => {
    let correct = 0;
    TEST_DATA.reading.questions.forEach(q => {
      // Безопасное получение ответа с защитой от undefined
      const userAnswer = answers[`r-${q.id}`];
      if (userAnswer === q.correct) correct++;
    });
    return { correct, total: TEST_DATA.reading.questions.length };
  };

  const calculateListeningScore = () => {
    let correct = 0;
    TEST_DATA.listening.questions.forEach(q => {
      // Безопасное получение ответа: если нет ответа, используем пустую строку
      const rawAnswer = answers[`l-${q.id}`] || '';
      const userAnswer = rawAnswer.toLowerCase().trim();
      const correctAnswer = q.correct.toLowerCase();
      
      if (userAnswer === correctAnswer || (q.type === 'multiple_choice' && rawAnswer === q.correct)) {
        correct++;
      }
    });
    return { correct, total: TEST_DATA.listening.questions.length };
  };

  // --- RENDERERS ---

  // 1. MENU SCREEN
  if (activeSection === 'menu') {
    return (
      <section id="mock-test" className="py-24 bg-uni-gray">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">IELTS Mock Test Center</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Официальный симулятор экзамена. Выберите модуль для практики в условиях, максимально приближенных к реальным.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Listening Card */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500 flex flex-col">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Headphones className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Listening</h3>
              <p className="text-gray-500 text-center text-sm mb-6 pb-4 border-b border-gray-100">30 minutes • 4 Parts</p>
              
              <ul className="text-sm text-gray-600 mb-8 space-y-3 flex-1">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>Native audio simulation</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>Gap-fill & Multiple choice</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>Real-time playback controls</span></li>
              </ul>
              
              <button onClick={() => startSection('listening')} className="w-full py-3 border-2 border-blue-500 text-blue-600 font-bold rounded hover:bg-blue-50 transition">
                Start Module
              </button>
            </motion.div>
            
            {/* Reading Card */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-uni-primary flex flex-col">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-7 h-7 text-uni-primary" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Reading</h3>
              <p className="text-gray-500 text-center text-sm mb-6 pb-4 border-b border-gray-100">60 minutes • 3 Passages</p>
              
              <ul className="text-sm text-gray-600 mb-8 space-y-3 flex-1">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>Official split-screen UI</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>Academic text sources</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>T/F/NG & Matching tasks</span></li>
              </ul>

              <button onClick={() => startSection('reading')} className="w-full py-3 bg-uni-primary text-white font-bold rounded hover:bg-red-800 shadow-md transition">
                Start Module
              </button>
            </motion.div>
            
            {/* Writing Card */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500 flex flex-col">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <PenTool className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Writing</h3>
              <p className="text-gray-500 text-center text-sm mb-6 pb-4 border-b border-gray-100">60 minutes • Task 2</p>
              
              <ul className="text-sm text-gray-600 mb-8 space-y-3 flex-1">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>Official Scoring Criteria</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>Automated Assessment</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/> <span>Detailed performance report</span></li>
              </ul>

              <button onClick={() => startSection('writing')} className="w-full py-3 border-2 border-yellow-500 text-yellow-600 font-bold rounded hover:bg-yellow-50 transition">
                Start Module
              </button>
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
    const wWords = getWordCount();
    
    // Проверяем, есть ли ответы в конкретных секциях, чтобы не рендерить пустые блоки
    const hasReading = Object.keys(answers).some(k => k.startsWith('r-'));
    const hasListening = Object.keys(answers).some(k => k.startsWith('l-'));

    return (
      <section className="py-24 bg-uni-gray min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-3xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Official Test Report</h2>
            <p className="text-gray-500 text-sm mt-2">Evaluation generated by Margulan Assessment System</p>
          </div>

          <div className="space-y-6">
            {/* Reading/Listening Results */}
            {(hasReading || hasListening) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {hasReading && (
                   <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
                     <h3 className="font-bold text-uni-primary mb-2">Reading</h3>
                     <p className="text-4xl font-serif font-bold">{rScore.correct} <span className="text-lg text-gray-400 font-sans">/ {rScore.total}</span></p>
                   </div>
                 )}
                 {hasListening && (
                   <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center">
                     <h3 className="font-bold text-blue-600 mb-2">Listening</h3>
                     <p className="text-4xl font-serif font-bold">{lScore.correct} <span className="text-lg text-gray-400 font-sans">/ {lScore.total}</span></p>
                   </div>
                 )}
              </div>
            )}

            {/* Writing Grading Section */}
            {writingText.length > 0 && (
              <div className="bg-yellow-50 p-8 rounded-xl border border-yellow-200 shadow-inner">
                <div className="mb-6 border-b border-yellow-200 pb-4 flex justify-between items-center">
                  <h3 className="font-bold text-xl text-yellow-800 flex items-center gap-2">
                    <PenTool className="w-5 h-5" /> Writing Assessment
                  </h3>
                  <span className={`font-mono font-bold px-3 py-1 rounded ${wWords >= 250 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {wWords} / 250 words
                  </span>
                </div>

                {/* Loading State */}
                {isGrading && (
                  <div className="flex flex-col items-center justify-center py-10 text-yellow-800">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-yellow-600" />
                    <p className="font-bold text-lg">Calculating Official Band Score...</p>
                    <p className="text-sm text-gray-500">Analyzing criteria: TR, CC, LR, GRA</p>
                  </div>
                )}

                {/* Feedback Result */}
                {!isGrading && aiFeedback && (
                  <div className="bg-white p-8 rounded-lg border border-yellow-100 text-gray-800 animate-in fade-in duration-500 shadow-sm">
                    <div className="prose prose-sm max-w-none text-gray-800 font-serif leading-relaxed" dangerouslySetInnerHTML={{ __html: aiFeedback }} />
                  </div>
                )}
                
                {/* Fallback */}
                {!isGrading && !aiFeedback && writingText.length <= 50 && (
                   <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded border border-red-100">
                     <AlertCircle className="w-5 h-5" />
                     <p>Submission length insufficient for assessment (Minimum 50 words required).</p>
                   </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <button onClick={() => setActiveSection('menu')} className="bg-uni-secondary text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition">
              Return to Menu
            </button>
          </div>
        </div>
      </section>
    );
  }

  // --- INTERFACE (Listening, Reading, Writing) ---
  return (
    <section className="fixed inset-0 z-[60] bg-gray-100 flex flex-col h-screen">
      {/* Top Bar */}
      <div className="bg-white h-16 border-b border-gray-300 flex items-center justify-between px-6 flex-shrink-0">
        <div className="font-bold text-xl flex items-center gap-2 text-gray-800">
           {activeSection === 'writing' && <PenTool className="w-5 h-5"/>}
           {activeSection === 'reading' && <BookOpen className="w-5 h-5"/>}
           {activeSection === 'listening' && <Headphones className="w-5 h-5"/>}
           IELTS {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </div>
        
        {activeSection === 'listening' && (
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-1 rounded-full border border-gray-200 shadow-inner">
            <button onClick={() => setIsPlaying(!isPlaying)} className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition">
              {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
            </button>
            <div className="w-48 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000 ease-linear" style={{width: `${audioProgress}%`}}/>
            </div>
          </div>
        )}

        <div className={`font-mono font-bold text-xl flex items-center gap-2 ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-uni-primary'}`}>
          <Clock className="w-5 h-5" /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side (Material) */}
        <div className="w-1/2 p-8 overflow-y-auto border-r border-gray-300 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
          {activeSection === 'writing' && <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: TEST_DATA.writing.prompt }} />}
          {activeSection === 'reading' && <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: TEST_DATA.reading.text }} />}
          {activeSection === 'listening' && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Headphones size={80} className="opacity-10 mb-4"/>
              <p className="text-sm font-medium opacity-60">Audio track visualization</p>
            </div>
          )}
        </div>

        {/* Right Side (Questions/Input) */}
        <div className="w-1/2 p-8 overflow-y-auto bg-gray-50">
          {activeSection === 'writing' ? (
            <div className="h-full flex flex-col">
              <textarea 
                value={writingText}
                onChange={e => setWritingText(e.target.value)}
                placeholder="Start typing your response here..."
                className="flex-1 p-8 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-uni-primary/20 focus:border-uni-primary text-lg font-serif leading-relaxed shadow-sm transition-all outline-none"
                spellCheck={false}
              />
              {/* WORD COUNT DISPLAY */}
              <div className="mt-3 flex justify-end">
                <span className={`text-sm font-bold px-3 py-1 rounded transition-colors ${getWordCount() >= 250 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  Word Count: {getWordCount()} / 250
                </span>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-8">
              {TEST_DATA[activeSection as 'reading' | 'listening'].questions.map((q, i) => {
                 if (i !== currentQuestionIndex) return null;
                 const prefix = activeSection === 'reading' ? 'r-' : 'l-';
                 return (
                   <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                     <h3 className="font-bold text-lg mb-6 text-gray-900 leading-snug">{q.question}</h3>
                     
                     {q.type === 'multiple_choice' && q.options?.map((opt, idx) => (
                       <label key={idx} className="flex items-center p-4 border border-gray-200 rounded-lg mb-3 cursor-pointer hover:bg-gray-50 hover:border-uni-primary/30 transition-all">
                         <input type="radio" checked={answers[`${prefix}${q.id}`] === opt.split('.')[0].trim()} onChange={() => setAnswers(p => ({...p, [`${prefix}${q.id}`]: opt.split('.')[0].trim()}))} className="w-5 h-5 text-uni-primary border-gray-300 focus:ring-uni-primary mr-3"/>
                         <span className="text-gray-700">{opt}</span>
                       </label>
                     ))}
                     
                     {q.type === 'true_false' && (
                       <div className="flex gap-3 mt-4">{q.options?.map(opt => (
                         <button key={opt} onClick={() => setAnswers(p => ({...p, [`${prefix}${q.id}`]: opt}))} className={`flex-1 py-3 border rounded font-bold transition-all shadow-sm ${answers[`${prefix}${q.id}`] === opt ? 'bg-uni-primary text-white border-uni-primary' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>{opt}</button>
                       ))}</div>
                     )}
                     
                     {q.type === 'gap_fill' && (
                       <div className="relative mt-2">
                         <input type="text" value={answers[`${prefix}${q.id}`] || ''} onChange={e => setAnswers(p => ({...p, [`${prefix}${q.id}`]: e.target.value}))} className="w-full p-4 pl-4 border border-gray-300 rounded font-bold text-lg focus:ring-2 focus:ring-uni-primary/20 focus:border-uni-primary outline-none transition-all" placeholder="Type answer here..."/>
                       </div>
                     )}
                   </div>
                 );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white h-20 border-t border-gray-300 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex gap-2">
          {activeSection !== 'writing' && TEST_DATA[activeSection as 'reading'|'listening'].questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQuestionIndex(i)} className={`w-9 h-9 rounded font-bold transition-all ${currentQuestionIndex === i ? 'bg-uni-secondary text-white shadow-md scale-105' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{i+1}</button>
          ))}
        </div>
        <div className="flex gap-4">
           {activeSection !== 'writing' && <button onClick={() => setCurrentQuestionIndex(p => Math.max(0, p-1))} className="px-5 py-2.5 bg-white border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-50 transition">Prev</button>}
           {activeSection !== 'writing' && currentQuestionIndex < TEST_DATA[activeSection as 'reading'|'listening'].questions.length-1 ? (
             <button onClick={() => setCurrentQuestionIndex(p => p+1)} className="px-5 py-2.5 bg-uni-secondary text-white rounded font-bold hover:bg-gray-800 transition shadow-md">Next</button>
           ) : (
             <button onClick={finishSection} className="px-8 py-2.5 bg-uni-primary text-white rounded font-bold shadow-md hover:bg-red-800 transition flex items-center gap-2">
               Submit Section <CheckCircle2 size={18}/>
             </button>
           )}
        </div>
      </div>
    </section>
  );
}