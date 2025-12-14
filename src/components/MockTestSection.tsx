import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Clock, CheckCircle2, Play, Pause, Headphones, BookOpen, PenTool, Loader2, AlertCircle } from 'lucide-react';
import { Language } from '../types/language';
import { LISTENING_DATA, READING_DATA } from '../data/ieltsData';
import ListeningPart from './test-sections/ListeningPart';
import ReadingPart from './test-sections/ReadingPart';
import WritingPart from './test-sections/WritingPart';

type SectionType = 'menu' | 'listening' | 'reading' | 'writing' | 'results';

export default function MockTestSection({ language }: { language: Language }) {
  const [activeSection, setActiveSection] = useState<SectionType>('menu');
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [writingText, setWritingText] = useState("");
  
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
    let duration = 0;
    if (section === 'listening') duration = LISTENING_DATA.duration;
    if (section === 'reading') duration = READING_DATA.duration;
    if (section === 'writing') duration = 3600;

    setTimeLeft(duration);
    setAnswers({});
    setWritingText("");
    setAiFeedback(null);
    setAudioProgress(0);
    setIsPlaying(section === 'listening');
  };

  const finishSection = () => {
    setActiveSection('results');
    setIsPlaying(false);
  };

  // --- AI GRADING ---
  const handleAiGrading = async () => {
    setIsGrading(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("No API Key");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `ACT AS AN OFFICIAL IELTS EXAMINER. Evaluate this Essay: "${writingText}". Give HTML output with Official Band Score and feedback.`;
      
      const result = await model.generateContent(prompt);
      setAiFeedback(result.response.text());
    } catch (error) {
      setAiFeedback("<p style='color:red'>Assessment service unavailable.</p>");
    } finally {
      setIsGrading(false);
    }
  };

  // --- SCORING ---
  const calculateScores = () => {
    let rScore = 0, lScore = 0;
    
    // Reading
    READING_DATA.passages.forEach(p => {
      p.questions.forEach(q => {
        if (answers[`r-${q.id}`] === q.correct) rScore++;
      });
    });

    // Listening
    LISTENING_DATA.questions.forEach(q => {
      const raw = answers[`l-${q.id}`] || '';
      if (raw.toLowerCase().trim() === q.correct.toLowerCase() || (q.type === 'multiple_choice' && raw === q.correct)) {
        lScore++;
      }
    });

    // Calculate Totals
    const rTotal = READING_DATA.passages.reduce((acc, p) => acc + p.questions.length, 0);
    const lTotal = LISTENING_DATA.questions.length;

    return { rScore, rTotal, lScore, lTotal };
  };

  // --- RENDERS ---
  if (activeSection === 'menu') {
    return (
      <section id="mock-test" className="py-24 bg-uni-gray">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">IELTS Mock Test Center</h2>
            <p className="text-gray-600">Official Simulator. Choose a module.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Listening */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500 flex flex-col items-center text-center">
              <Headphones className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Listening</h3>
              <p className="text-sm text-gray-500 mb-6">30 mins • 4 Parts</p>
              <button onClick={() => startSection('listening')} className="w-full py-2 border-2 border-blue-500 text-blue-600 font-bold rounded hover:bg-blue-50">Start</button>
            </motion.div>
            {/* Reading */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-uni-primary flex flex-col items-center text-center">
              <BookOpen className="w-12 h-12 text-uni-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Reading</h3>
              <p className="text-sm text-gray-500 mb-6">60 mins • 3 Passages</p>
              <button onClick={() => startSection('reading')} className="w-full py-2 bg-uni-primary text-white font-bold rounded hover:bg-red-800">Start</button>
            </motion.div>
            {/* Writing */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500 flex flex-col items-center text-center">
              <PenTool className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Writing</h3>
              <p className="text-sm text-gray-500 mb-6">60 mins • Task 2</p>
              <button onClick={() => startSection('writing')} className="w-full py-2 border-2 border-yellow-500 text-yellow-600 font-bold rounded hover:bg-yellow-50">Start</button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (activeSection === 'results') {
    const { rScore, rTotal, lScore, lTotal } = calculateScores();
    const wWords = writingText.trim().split(/\s+/).filter(w => w.length > 0).length;
    const hasReading = Object.keys(answers).some(k => k.startsWith('r-'));
    const hasListening = Object.keys(answers).some(k => k.startsWith('l-'));

    return (
      <section className="py-24 bg-uni-gray min-h-screen flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-3xl w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Test Results</h2>
          <div className="space-y-6">
            {(hasReading || hasListening) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hasReading && <div className="bg-red-50 p-6 rounded text-center"><h3 className="font-bold text-uni-primary">Reading</h3><p className="text-4xl font-serif">{rScore} / {rTotal}</p></div>}
                {hasListening && <div className="bg-blue-50 p-6 rounded text-center"><h3 className="font-bold text-blue-600">Listening</h3><p className="text-4xl font-serif">{lScore} / {lTotal}</p></div>}
              </div>
            )}
            {writingText.length > 0 && (
              <div className="bg-yellow-50 p-8 rounded shadow-inner">
                <h3 className="font-bold text-lg text-yellow-800 mb-4">Writing Assessment</h3>
                {isGrading && <div className="text-center"><Loader2 className="animate-spin inline mr-2"/> Calculating Score...</div>}
                {!isGrading && aiFeedback && <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: aiFeedback }} />}
              </div>
            )}
          </div>
          <button onClick={() => setActiveSection('menu')} className="mt-8 w-full bg-uni-secondary text-white py-3 rounded font-bold">Return to Menu</button>
        </div>
      </section>
    );
  }

  return (
    <section className="fixed inset-0 z-[60] bg-gray-100 flex flex-col h-screen">
      {/* Top Bar */}
      <div className="bg-white h-16 border-b border-gray-300 flex items-center justify-between px-6 flex-shrink-0">
        <div className="font-bold text-xl flex items-center gap-2">
          {activeSection === 'reading' && <BookOpen className="w-5 h-5"/>}
          {activeSection === 'listening' && <Headphones className="w-5 h-5"/>}
          {activeSection === 'writing' && <PenTool className="w-5 h-5"/>}
          IELTS {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </div>
        {activeSection === 'listening' && (
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-1 rounded-full border border-gray-200">
             <button onClick={() => setIsPlaying(!isPlaying)} className="bg-blue-600 text-white p-1 rounded-full">{isPlaying ? <Pause size={16}/> : <Play size={16}/>}</button>
             <div className="w-32 h-2 bg-gray-300 rounded-full"><div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${audioProgress}%`}}/></div>
          </div>
        )}
        <div className={`font-mono font-bold text-xl flex items-center gap-2 ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-uni-primary'}`}>
          <Clock className="w-5 h-5" /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Main Content */}
      {activeSection === 'listening' && <ListeningPart answers={answers} setAnswers={setAnswers} />}
      {activeSection === 'reading' && <ReadingPart answers={answers} setAnswers={setAnswers} />}
      {activeSection === 'writing' && <WritingPart writingText={writingText} setWritingText={setWritingText} />}

      {/* Bottom Bar */}
      <div className="bg-white h-20 border-t border-gray-300 px-6 flex items-center justify-end flex-shrink-0">
        <button onClick={finishSection} className="px-8 py-2.5 bg-uni-primary text-white rounded font-bold shadow-md hover:bg-red-800 transition flex items-center gap-2">
          Submit Section <CheckCircle2 size={18}/>
        </button>
      </div>
    </section>
  );
}