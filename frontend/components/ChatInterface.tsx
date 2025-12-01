'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MemoryStick, Trash2 } from 'lucide-react'
import MessageBubble from './MessageBubble'
import MicrophoneButton from './MicrophoneButton'
import MemorySidebar from './MemorySidebar'
import VoiceVisualizer from './VoiceVisualizer' 
import { chatAPI, getAudioUrl } from '@/lib/api'
import { Message, Memory } from '@/lib/types' 
import { useAudioRecorder } from '@/hooks/useAudioRecorder'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [memories, setMemories] = useState<Memory[]>([])
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const { isRecording, audioLevel, startRecording, stopRecording } = useAudioRecorder()

  useEffect(() => {
    loadMemories()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMemories = async () => {
    try {
      const mems = await chatAPI.getMemories()
      setMemories(mems)
    } catch (error) {
      console.error('Error loading memories:', error)
    }
  }

  const handleSendText = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const response = await chatAPI.sendTextMessage(inputText)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        audioUrl: response.audio_url,
      }

      setMessages(prev => [...prev, assistantMessage])

      // Auto-play audio response
      if (response.audio_url && audioRef.current) {
        audioRef.current.src = getAudioUrl(response.audio_url)
        audioRef.current.play()
      }

      loadMemories()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceToggle = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording()
      setIsLoading(true)

      try {
        const response = await chatAPI.sendVoiceMessage(audioBlob)
        
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: response.response.split('\n')[0], // Transcription
          timestamp: new Date(),
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          audioUrl: response.audio_url,
        }

        setMessages(prev => [...prev, assistantMessage])

        // Auto-play audio response
        if (response.audio_url && audioRef.current) {
          audioRef.current.src = getAudioUrl(response.audio_url)
          audioRef.current.play()
        }

        loadMemories()
      } catch (error) {
        console.error('Error sending voice message:', error)
        alert('Failed to process voice message.')
      } finally {
        setIsLoading(false)
      }
    } else {
      await startRecording()
    }
  }

  const handleClearChat = async () => {
    if (confirm('Clear all chat history?')) {
      await chatAPI.clearChatHistory()
      setMessages([])
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="glass border-b border-white/10 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center animate-glow">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold neon-glow">AI Assistant</h1>
              <p className="text-sm text-gray-400">With Long-Term Memory</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg glass hover:bg-white/10 transition-all"
            >
              <MemoryStick className="w-5 h-5 text-neon-blue" />
            </button>
            <button
              onClick={handleClearChat}
              className="p-2 rounded-lg glass hover:bg-white/10 transition-all"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </motion.header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-2 items-center text-neon-blue"
            >
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">Thinking...</span>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Visualizer */}
        {isRecording && <VoiceVisualizer audioLevel={audioLevel} />}

        {/* Input Area */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="glass border-t border-white/10 p-4"
        >
          <div className="flex items-center gap-3">
            {mode === 'text' ? (
              <>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendText}
                  disabled={isLoading || !inputText.trim()}
                  className="p-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex-1 flex justify-center">
                <MicrophoneButton
                  isRecording={isRecording}
                  onClick={handleVoiceToggle}
                />
              </div>
            )}
            
            <button
              onClick={() => setMode(mode === 'text' ? 'voice' : 'text')}
              className="p-3 rounded-lg glass hover:bg-white/10 transition-all"
            >
              {mode === 'text' ? (
                <Mic className="w-5 h-5 text-neon-purple" />
              ) : (
                <Send className="w-5 h-5 text-neon-blue" />
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Memory Sidebar */}
      <MemorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        memories={memories}
        onRefresh={loadMemories}
      />

      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
