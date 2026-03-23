'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function Logo() {
  return (
    <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 shrink-0">
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-[2px] opacity-70"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <motion.div 
        className="absolute inset-0.5 bg-zinc-950 rounded-[10px] flex items-center justify-center overflow-hidden z-10"
      >
        <motion.span 
          className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-black text-lg md:text-xl z-20 relative pointer-events-none"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: '200% 200%' }}
        >
          J
        </motion.span>
        {/* Subtle interior glow */}
        <motion.div 
          className="absolute inset-0 bg-indigo-500/20 mix-blend-screen"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <Sparkles className="w-3 h-3 text-pink-400 absolute top-1 right-1 opacity-60 z-10" />
      </motion.div>
    </div>
  )
}
