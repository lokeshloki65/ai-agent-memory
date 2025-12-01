'use client'

import { motion } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'

interface MicrophoneButtonProps {
  isRecording: boolean
  onClick: () => void
}

export default function MicrophoneButton({ isRecording, onClick }: MicrophoneButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
        isRecording
          ? 'bg-red-500 animate-pulse'
          : 'bg-gradient-to-br from-neon-blue to-neon-purple hover:scale-110'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {isRecording ? (
        <MicOff className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
      
      {isRecording && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-red-400"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}