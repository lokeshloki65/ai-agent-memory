'use client'

import { motion } from 'framer-motion'

interface VoiceVisualizerProps {
  audioLevel: number
}

export default function VoiceVisualizer({ audioLevel }: VoiceVisualizerProps) {
  const bars = Array.from({ length: 20 })

  return (
    <div className="absolute bottom-32 left-0 right-0 flex items-center justify-center gap-1 px-4">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-neon-blue to-neon-purple rounded-full"
          animate={{
            height: Math.max(4, audioLevel * 100 * (0.5 + Math.random())),
          }}
          transition={{
            duration: 0.1,
          }}
        />
      ))}
    </div>
  )
}