import axios from 'axios'
import { ChatResponse, Memory } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const chatAPI = {
  sendTextMessage: async (message: string): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/chat/text', { message })
    return response.data
  },

  sendVoiceMessage: async (audioBlob: Blob): Promise<ChatResponse> => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'audio.webm')

    const response = await api.post<ChatResponse>('/chat/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getChatHistory: async () => {
    const response = await api.get('/chat/history')
    return response.data.history
  },

  clearChatHistory: async () => {
    await api.delete('/chat/history')
  },

  getMemories: async (): Promise<Memory[]> => {
    const response = await api.get('/memory/all')
    return response.data.memories
  },

  clearMemories: async () => {
    await api.delete('/memory/all')
  },

  addMemory: async (message: string) => {
    await api.post('/memory/add', { message })
  },
}

export const getAudioUrl = (audioPath: string) => {
  if (audioPath.startsWith('http')) return audioPath
  return `http://localhost:8000${audioPath}`
}