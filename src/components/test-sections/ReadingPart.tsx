import { useState } from 'react';
import { READING_DATA } from '../../data/ieltsData';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadingPartProps {
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function ReadingPart({ answers, setAnswers }: ReadingPartProps) {
  const [currentPassageId, setCurrentPassageId] = useState(1);
  const currentPassage = READING_DATA.passages.find(p => p.id === currentPassageId) || READING_DATA.passages[0];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* LEFT SIDE: TEXT */}
      <div className="w-1/2 p-8 overflow-y-auto border-r border-gray-300 bg-white shadow-inner">
        <h2 className="text-xl font-bold text-uni-primary mb-4">{currentPassage.title}</h2>
        <div 
          className="prose prose-sm md:prose-base max-w-none text-gray-800 font-serif leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: currentPassage.text }} 
        />
      </div>

      {/* RIGHT SIDE: QUESTIONS */}
      <div className="w-1/2 flex flex-col bg-gray-50">
        
        {/* Navigation Tabs for Passages */}
        <div className="flex bg-white border-b border-gray-200">
          {READING_DATA.passages.map(p => (
            <button
              key={p.id}
              onClick={() => setCurrentPassageId(p.id)}
              className={`flex-1 py-3 text-sm font-bold transition-all ${
                currentPassageId === p.id 
                  ? 'border-b-4 border-uni-primary text-uni-primary bg-red-50' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Passage {p.id}
            </button>
          ))}
        </div>

        {/* Questions Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPassageId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              {currentPassage.questions.map((q, i) => (
                <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between mb-3">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question {q.id}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-4">{q.question}</h3>
                  
                  {/* Multiple Choice */}
                  {q.type === 'multiple_choice' && q.options?.map((opt, idx) => (
                    <label key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-gray-50 hover:border-uni-primary/30 transition-all">
                      <input 
                        type="radio" 
                        checked={answers[`r-${q.id}`] === opt.split('.')[0].trim()} 
                        onChange={() => setAnswers(p => ({...p, [`r-${q.id}`]: opt.split('.')[0].trim()}))} 
                        className="w-4 h-4 text-uni-primary border-gray-300 focus:ring-uni-primary mr-3"
                      />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                  
                  {/* True/False */}
                  {q.type === 'true_false' && (
                    <div className="flex flex-wrap gap-2">
                      {q.options?.map(opt => (
                        <button 
                          key={opt} 
                          onClick={() => setAnswers(p => ({...p, [`r-${q.id}`]: opt}))} 
                          className={`px-4 py-2 border rounded text-sm font-bold transition-all ${answers[`r-${q.id}`] === opt ? 'bg-uni-primary text-white border-uni-primary' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Gap Fill */}
                  {q.type === 'gap_fill' && (
                    <div className="relative">
                      <input 
                        type="text" 
                        value={answers[`r-${q.id}`] || ''} 
                        onChange={e => setAnswers(p => ({...p, [`r-${q.id}`]: e.target.value}))} 
                        className="w-full p-3 border border-gray-300 rounded font-bold text-gray-900 focus:ring-2 focus:ring-uni-primary/20 focus:border-uni-primary outline-none transition-all" 
                        placeholder="Type answer here..."
                      />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}