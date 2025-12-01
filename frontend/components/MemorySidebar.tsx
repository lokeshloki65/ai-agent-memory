'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, RefreshCw, Trash2, Brain } from 'lucide-react'
import { Memory } from '@/lib/types'
import { chatAPI } from '@/lib/api'

interface MemorySidebarProps {
  isOpen: boolean
  onClose: () => void
  memories: Memory[]
  onRefresh: () => void
}

export default function MemorySidebar({ isOpen, onClose, memories, onRefresh }: MemorySidebarProps) {
  const handleClearMemories = async () => {
    if (confirm('Clear all memories? This cannot be undone.')) {
      await chatAPI.clearMemories()
      onRefresh()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 glass border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-neon-purple" />
                <h2 className="text-lg font-bold">Memory Bank</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onRefresh}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearMemories}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Memories List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {memories.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No memories stored yet</p>
                  <p className="text-sm mt-2">Start chatting to build memories!</p>
                </div>
              ) : (
                memories.map((memory, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-neon-blue/50 transition-all"
                  >
                    <p className="text-sm">{memory.content}</p>
                    {memory.metadata.trigger && (
                      <span className="text-xs text-neon-purple mt-2 block">
                        Type: {memory.metadata.trigger}
                      </span>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}