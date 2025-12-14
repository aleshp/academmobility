import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Импорт ИИ
import { Clock, ChevronLeft, ChevronRight, HelpCircle, CheckCircle2, Play, Pause, Headphones, BookOpen, PenTool, Loader2, Sparkles } from 'lucide-react';
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

  // AI Grading State
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
    setAiFeedback(null); // Reset feedback
    setCurrentQuestionIndex(0);
    setAudioProgress(0);
    setIsPlaying(section === 'listening');
  };

  const finishSection = () => {
    setActiveSection('results');
    setIsPlaying(false);
  };

  // --- AI GRADING FUNCTION ---
  const handleAiGrading = async () => {
    if (!writingText || writingText.length < 50) return; // Basic validation
    
    setIsGrading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Промпт для проверки эссе
      const prompt = `
        ACT AS AN OFFICIAL IELTS EXAMINER.
        
        TASK:
        Evaluate the following IELTS Writing Task 2 essay.
        
        PROMPT TOPIC:
        "Some people believe that studying at a university in a foreign country is the best way to learn about another culture. Others believe that it is better to learn about other cultures through the media and the internet. Discuss both views and give your own opinion."
        
        STUDENT'S ESSAY:
        "${writingText}"
        
        OUTPUT FORMAT:
        Give a strict evaluation in the following HTML format (no markdown, just simple tags like <b>, <br>, <ul>, <li>):
        1. <b>Estimated Band Score:</b> (e.g., 6.5)
        2. <b>Feedback by Criteria:</b>
           - <b>Task Response:</b> [Comment]
           - <b>Coherence & Cohesion:</b> [Comment]
           - <b>Lexical Resource:</b> [Comment]
           - <b>Grammatical Range:</b> [Comment]
        3. <b>Improvements:</b> [List 2-3 specific things to improve]
        
        Be concise, professional, and strict.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      setAiFeedback(response.text());
    } catch (error) {
      console.error("AI Error:", error);
      setAiFeedback("Error connecting to AI Tutor. Please try again.");
    } finally {
      setIsGrading(false);
    }
  };

  // Score Calculators
  const calculateReadingScore = () => {
    let correct = 0;
    TEST_DATA.reading.questions.forEach(q => { if (answers[`r-${q.id}`] === q.correct) correct++; });
    return { correct, total: TEST_DATA.reading.questions.length };
  };

  const calculateListeningScore = () => {
    let correct = 0;
    TEST_DATA.listening.questions.forEach(q => {
      const u = answers[`l-${q.id}`]?.toLowerCase().trim();
      if (u === q.correct.toLowerCase() || (q.type === 'multiple_choice' && answers[`l-${q.id}`] === q.correct)) correct++;
    });
    return { correct, total: TEST_DATA.listening.questions.length };
  };

  const getWordCount = () => writingText.trim().split(/\s+/).filter(w => w.length > 0).length;

  // --- RENDERERS ---

  // 1. MENU
  if (activeSection === 'menu') {
    return (
      <section id="mock-test" className="py-24 bg-uni-gray">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">IELTS Mock Test Center</h2>
            <p className="text-gray-600">Практикуйтесь в реальных условиях с поддержкой ИИ.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cards */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500">
              <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-center mb-2">Listening</h3>
              <button onClick={() => startSection('listening')} className="w-full mt-4 py-2 border-2 border-blue-500 text-blue-600 font-bold rounded hover:bg-blue-50">Start</button>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-uni-primary">
              <BookOpen className="w-12 h-12 text-uni-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-center mb-2">Reading</h3>
              <button onClick={() => startSection('reading')} className="w-full mt-4 py-2 bg-uni-primary text-white font-bold rounded hover:bg-red-800">Start</button>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <div className="flex justify-center mb-4 relative">
                <PenTool className="w-12 h-12 text-yellow-600" />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">AI Powered</div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Writing + AI</h3>
              <button onClick={() => startSection('writing')} className="w-full mt-4 py-2 border-2 border-yellow-500 text-yellow-600 font-bold rounded hover:bg-yellow-50">Start</button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // 2. RESULTS
  if (activeSection === 'results') {
    const rScore = calculateReadingScore();
    const lScore = calculateListeningScore();
    const wWords = getWordCount();

    return (
      <section className="py-24 bg-uni-gray min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-3xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Test Completed</h2>
          </div>

          <div className="space-y-6">
            {/* Reading/Listening Results */}
            {(Object.keys(answers).some(k => k.startsWith('r-')) || Object.keys(answers).some(k => k.startsWith('l-'))) && (
              <div className="grid grid-cols-2 gap-4">
                 {Object.keys(answers).some(k => k.startsWith('r-')) && (
                   <div className="bg-red-50 p-4 rounded border border-red-100">
                     <h3 className="font-bold text-uni-primary">Reading Score</h3>
                     <p className="text-2xl">{rScore.correct} <span className="text-sm text-gray-500">/ {rScore.total}</span></p>
                   </div>
                 )}
                 {Object.keys(answers).some(k => k.startsWith('l-')) && (
                   <div className="bg-blue-50 p-4 rounded border border-blue-100">
                     <h3 className="font-bold text-blue-600">Listening Score</h3>
                     <p className="text-2xl">{lScore.correct} <span className="text-sm text-gray-500">/ {lScore.total}</span></p>
                   </div>
                 )}
              </div>
            )}

            {/* Writing AI Section */}
            {writingText.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-yellow-800 flex items-center gap-2">
                      <PenTool className="w-5 h-5" /> Writing Analysis
                    </h3>
                    <p className="text-sm text-yellow-700">Words: {wWords} / 250</p>
                  </div>
                  
                  {/* BUTTON TO TRIGGER AI */}
                  {!aiFeedback && !isGrading && (
                    <button 
                      onClick={handleAiGrading}
                      className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                    >
                      <Sparkles className="w-4 h-4" /> Check with AI Tutor
                    </button>
                  )}
                </div>

                {/* Loading State */}
                {isGrading && (
                  <div className="flex flex-col items-center justify-center py-8 text-yellow-700">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p>AI Tutor is reading your essay...</p>
                  </div>
                )}

                {/* AI Feedback Result */}
                {aiFeedback && (
                  <div className="bg-white p-6 rounded-lg border border-yellow-200 text-gray-800 animate-in fade-in duration-500">
                    <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: aiFeedback }} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <button onClick={() => setActiveSection('menu')} className="bg-uni-secondary text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition">
              Back to Menu
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
        <div className="font-bold text-xl flex items-center gap-2">
           {activeSection === 'writing' && <PenTool className="w-5 h-5"/>}
           {activeSection === 'reading' && <BookOpen className="w-5 h-5"/>}
           {activeSection === 'listening' && <Headphones className="w-5 h-5"/>}
           IELTS {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </div>
        
        {activeSection === 'listening' && (
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-1 rounded-full border border-gray-200">
            <button onClick={() => setIsPlaying(!isPlaying)} className="bg-blue-600 text-white p-1 rounded-full">{isPlaying ? <Pause size={16}/> : <Play size={16}/>}</button>
            <div className="w-32 h-2 bg-gray-300 rounded-full"><div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${audioProgress}%`}}/></div>
          </div>
        )}

        <div className={`font-mono font-bold text-xl flex items-center gap-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-uni-primary'}`}>
          <Clock className="w-5 h-5" /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 p-8 overflow-y-auto border-r border-gray-300 bg-white">
          {activeSection === 'writing' && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: TEST_DATA.writing.prompt }} />}
          {activeSection === 'reading' && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: TEST_DATA.reading.text }} />}
          {activeSection === 'listening' && <div className="flex items-center justify-center h-full text-gray-400"><Headphones size={64} className="opacity-20"/></div>}
        </div>

        {/* Right Side */}
        <div className="w-1/2 p-8 overflow-y-auto bg-gray-50">
          {activeSection === 'writing' ? (
            <div className="h-full flex flex-col">
              <textarea 
                value={writingText}
                onChange={e => setWritingText(e.target.value)}
                placeholder="Start typing your essay..."
                className="flex-1 p-6 border rounded-lg resize-none focus:ring-2 focus:ring-uni-primary text-lg font-serif"
                spellCheck={false}
              />
              <div className="mt-2 text-right text-gray-500 font-bold">Words: {getWordCount()}</div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-6">
              {TEST_DATA[activeSection as 'reading' | 'listening'].questions.map((q, i) => {
                 if (i !== currentQuestionIndex) return null;
                 const prefix = activeSection === 'reading' ? 'r-' : 'l-';
                 return (
                   <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                     <h3 className="font-bold text-lg mb-4">{q.question}</h3>
                     {q.type === 'multiple_choice' && q.options?.map((opt, idx) => (
                       <label key={idx} className="flex items-center p-3 border rounded mb-2 cursor-pointer hover:bg-gray-50">
                         <input type="radio" checked={answers[`${prefix}${q.id}`] === opt.split('.')[0].trim()} onChange={() => setAnswers(p => ({...p, [`${prefix}${q.id}`]: opt.split('.')[0].trim()}))} className="mr-3"/>
                         {opt}
                       </label>
                     ))}
                     {q.type === 'true_false' && (
                       <div className="flex gap-2">{q.options?.map(opt => (
                         <button key={opt} onClick={() => setAnswers(p => ({...p, [`${prefix}${q.id}`]: opt}))} className={`flex-1 py-2 border rounded ${answers[`${prefix}${q.id}`] === opt ? 'bg-uni-primary text-white' : ''}`}>{opt}</button>
                       ))}</div>
                     )}
                     {q.type === 'gap_fill' && (
                       <input type="text" value={answers[`${prefix}${q.id}`] || ''} onChange={e => setAnswers(p => ({...p, [`${prefix}${q.id}`]: e.target.value}))} className="w-full p-3 border rounded font-bold" placeholder="Answer..."/>
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
            <button key={i} onClick={() => setCurrentQuestionIndex(i)} className={`w-8 h-8 rounded font-bold ${currentQuestionIndex === i ? 'bg-uni-secondary text-white' : 'bg-gray-200'}`}>{i+1}</button>
          ))}
        </div>
        <div className="flex gap-4">
           {activeSection !== 'writing' && <button onClick={() => setCurrentQuestionIndex(p => Math.max(0, p-1))} className="px-4 py-2 bg-gray-200 rounded font-bold">Prev</button>}
           {activeSection !== 'writing' && currentQuestionIndex < TEST_DATA[activeSection as 'reading'|'listening'].questions.length-1 ? (
             <button onClick={() => setCurrentQuestionIndex(p => p+1)} className="px-4 py-2 bg-uni-secondary text-white rounded font-bold">Next</button>
           ) : (
             <button onClick={finishSection} className="px-6 py-2 bg-uni-primary text-white rounded font-bold shadow hover:bg-red-800">Submit</button>
           )}
        </div>
      </div>
    </section>
  );
}