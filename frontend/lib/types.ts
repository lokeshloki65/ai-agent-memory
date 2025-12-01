export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioUrl?: string
}

export interface Memory {
  content: string
  metadata: Record<string, any>
}

export interface ChatResponse {
  response: string
  audio_url?: string
}