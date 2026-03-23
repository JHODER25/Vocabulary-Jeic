'use client'

import { useState, useEffect } from 'react'
import { Flashcard } from './Flashcard'
import { submitReview } from '@/app/dashboard/actions'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function FlashcardClient({ dueCards, isQuizMode = false }: { dueCards: any[], isQuizMode?: boolean }) {
  const [cards, setCards] = useState(dueCards)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (dueCards.length > 0 && (!cards.length || cards[0].word_id !== dueCards[0].word_id)) {
      setCards(dueCards)
      setCurrentIndex(0)
    }
  }, [dueCards])

  if (currentIndex >= cards.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg mx-auto"
      >
        <span className="text-6xl mb-4 block">🎉</span>
        <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
        <p className="text-zinc-400 mb-8">You've finished your reviews for now.</p>
        <button 
          onClick={() => window.location.href = '/dashboard'} 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition text-white inline-block"
        >
          Practice More Words
        </button>
      </motion.div>
    )
  }

  const currentCard = cards[currentIndex]
  const wordData = currentCard.words

  const handleGrade = async (quality: number) => {
    setCurrentIndex(prev => prev + 1)
    await submitReview({
      wordId: wordData.id,
      quality,
      progressId: currentCard.id
    })
  }

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Flashcard wordData={wordData} onGrade={handleGrade} isQuizMode={isQuizMode} />
        </motion.div>
      </AnimatePresence>
      <div className="mt-12 w-full max-w-sm mx-auto bg-zinc-800 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-500 h-full transition-all duration-500" 
          style={{ width: `${(currentIndex / cards.length) * 100}%` }}
        />
      </div>
      <div className="text-center mt-4 text-sm font-medium text-zinc-500">
        {currentIndex + 1} / {cards.length}
      </div>
    </div>
  )
}
