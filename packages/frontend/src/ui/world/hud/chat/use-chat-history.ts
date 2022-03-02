import create, { State } from 'zustand'

export interface ChatMessage {
  messageId: string
  type: 'system' | 'player'
  character?: {
    characterId: string
    name: string
  }
  message: string
}
export interface ChatHistoryState extends State {
  messages: ChatMessage[]
  addMessage(value: ChatMessage): void
  clear(): void
}

export const useChatHistoryState = create<ChatHistoryState>((set) => ({
  messages: [],
  addMessage: (value) =>
    set((state) => {
      state.messages.unshift(value)
    }),
  clear() {
    set((state) => {
      state.messages = []
    })
  },
}))
