'use client'

import { motion } from 'framer-motion'
import { Message } from '@/lib/types'
import { Volume2 } from 'lucide-react'
import { getAudioUrl } from '@/lib/api'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  const playAudio = () => {
    if (message.audioUrl) {
      const audio = new Audio(getAudioUrl(message.audioUrl))
      audio.play()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] p-4 rounded-2xl relative ${
          isUser
            ? 'bg-gradient-to-br from-neon-blue to-neon-purple text-white'
            : 'glass border border-white/10'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        
        {message.audioUrl && !isUser && (
          <button
            onClick={playAudio}
            className="mt-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
        
        <span className="text-xs opacity-50 mt-2 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  )
}