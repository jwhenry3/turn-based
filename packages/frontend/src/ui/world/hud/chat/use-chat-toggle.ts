import create, { State } from 'zustand'
export interface ChatToggleState extends State {
  opened: boolean
  toggleOpen(value: boolean): void
}

export const useChatToggleState = create<ChatToggleState>((set) => ({
  opened: false,
  toggleOpen: (value) =>
    set((state) => {
      state.opened = value
    }),
}))
