'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, RotateCw } from 'lucide-react'

type Word = {
  id: number;
  word: string;
  meaning: string;
  phonetic: string;
  examples: string[];
}

interface FlashcardProps {
  wordData: Word;
  onGrade: (quality: number) => void;
  isQuizMode?: boolean;
}

export function Flashcard({ wordData, onGrade, isQuizMode = false }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [quizInput, setQuizInput] = useState('')
  const [quizState, setQuizState] = useState<'idle' | 'wrong' | 'correct'>('idle')

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(wordData.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (quizInput.toLowerCase().trim() === wordData.word.toLowerCase().trim()) {
      setQuizState('correct')
      setTimeout(() => {
        setIsFlipped(true)
        onGrade(3) // Automatically grade as Easy 
      }, 800)
    } else {
      setQuizState('wrong')
      setTimeout(() => setQuizState('idle'), 500)
    }
  }

  const handleGiveUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setQuizState('wrong')
    setTimeout(() => {
      setIsFlipped(true)
      onGrade(0) // Automatically grade as Again
    }, 600)
  }

  useEffect(() => {
    setIsFlipped(false)
    setQuizInput('')
    setQuizState('idle')
  }, [wordData.word])

  return (
    <div className="w-full max-w-lg mx-auto perspective-1000">
      <motion.div
        className={`w-full h-[420px] relative preserve-3d ${!isQuizMode || isFlipped ? 'cursor-pointer' : ''}`}
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => {
          if (!isQuizMode || isFlipped) setIsFlipped(!isFlipped)
        }}
      >
        {/* Front */}
        <div className={`absolute w-full h-full backface-hidden bg-zinc-900 border ${quizState === 'wrong' ? 'border-red-500 shadow-red-500/20' : quizState === 'correct' ? 'border-green-500 shadow-green-500/20' : 'border-zinc-700/50 shadow-2xl'} rounded-2xl flex flex-col p-8 ${!isQuizMode ? 'items-center justify-center' : ''}`}>
          <button 
            type="button"
            onClick={handleAudio}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-800 text-zinc-300 hover:text-indigo-400 hover:bg-zinc-700 transition z-20"
          >
            <Volume2 className="w-6 h-6" />
          </button>

          {!isQuizMode ? (
            <>
              <h2 className="text-6xl font-black text-white tracking-tight mb-4 mt-auto">{wordData.word}</h2>
              <span className="text-zinc-500 flex items-center gap-2 mt-auto self-center">
                <RotateCw className="w-4 h-4" /> Tap to flip
              </span>
            </>
          ) : (
            <div className="flex flex-col h-full z-20 w-full">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6">Quiz Mode</span>
              <div className="flex-1">
                <h3 className="text-sm text-zinc-500 mb-2 font-bold">Meaning</h3>
                <p className="text-lg text-zinc-300 italic">"{wordData.meaning}"</p>
              </div>
              
              <form onSubmit={handleQuizSubmit} className="mt-auto w-full">
                <motion.input
                  animate={quizState === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  type="text"
                  autoFocus
                  placeholder="Type the word..."
                  value={quizState === 'wrong' ? wordData.word : quizInput}
                  onChange={(e) => setQuizInput(e.target.value)}
                  disabled={quizState !== 'idle'}
                  className={`w-full bg-zinc-950 border-2 ${quizState === 'wrong' ? 'border-red-500 text-red-500' : quizState === 'correct' ? 'border-green-500 text-green-500' : 'border-zinc-800 focus:border-indigo-500 text-white'} rounded-xl p-4 text-2xl text-center font-bold outline-none mb-3 transition-colors`}
                />
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={handleGiveUp} 
                    disabled={quizState !== 'idle'}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg py-3 font-medium transition disabled:opacity-50"
                  >
                    Show Answer
                  </button>
                  <button 
                    type="submit" 
                    disabled={quizState !== 'idle' || !quizInput}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-3 font-bold transition disabled:opacity-50"
                  >
                    Check
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden bg-zinc-800 border border-indigo-500/30 rounded-2xl shadow-2xl p-8 flex flex-col rotate-x-180 overflow-y-auto z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{wordData.word}</h2>
              <span className="text-indigo-300 font-mono text-lg">{wordData.phonetic}</span>
            </div>
            <button 
              onClick={handleAudio}
              className="p-2 rounded-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 transition"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Meaning</h3>
              <p className="text-lg text-zinc-200 leading-relaxed">{wordData.meaning}</p>
            </div>
            
            {wordData.examples && wordData.examples.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Examples</h3>
                <ul className="space-y-3">
                  {wordData.examples.map((ex, i) => (
                    <li key={i} className="text-zinc-300 italic border-l-2 border-indigo-500/30 pl-4 py-1">
                      "{ex}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* SRS Controls (Fade in when flipped - only in Classic mode) */}
      {!isQuizMode && (
        <motion.div 
          className="mt-8 grid grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            disabled={!isFlipped}
            onClick={(e) => { e.stopPropagation(); onGrade(0); setIsFlipped(false); }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-950/40 border border-red-900/50 hover:bg-red-900/40 text-red-400 transition"
          >
            <span className="font-bold mb-1">Again</span>
            <span className="text-xs opacity-70">&lt; 1m</span>
          </button>
          <button 
            disabled={!isFlipped}
            onClick={(e) => { e.stopPropagation(); onGrade(1); setIsFlipped(false); }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-950/40 border border-orange-900/50 hover:bg-orange-900/40 text-orange-400 transition"
          >
            <span className="font-bold mb-1">Hard</span>
            <span className="text-xs opacity-70">1d</span>
          </button>
          <button 
            disabled={!isFlipped}
            onClick={(e) => { e.stopPropagation(); onGrade(2); setIsFlipped(false); }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-green-950/40 border border-green-900/50 hover:bg-green-900/40 text-green-400 transition"
          >
            <span className="font-bold mb-1">Good</span>
            <span className="text-xs opacity-70">3d</span>
          </button>
          <button 
            disabled={!isFlipped}
            onClick={(e) => { e.stopPropagation(); onGrade(3); setIsFlipped(false); }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 hover:bg-blue-900/40 text-blue-400 transition"
          >
            <span className="font-bold mb-1">Easy</span>
            <span className="text-xs opacity-70">7d</span>
          </button>
        </motion.div>
      )}
    </div>
  )
}
