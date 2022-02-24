import create, { State } from 'zustand'
export interface LobbyState extends State {
  token?: string
  characterId?: string
  update(token: string, characterId: string): void
}
export const useAuthState = create<LobbyState>((set) => ({
  token: undefined,
  characterId: undefined,
  update: (token, characterId) =>
    set((state) => {
      ;(state.token = token), (state.characterId = characterId)
    }),
}))
