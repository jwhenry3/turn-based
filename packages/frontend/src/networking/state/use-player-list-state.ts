import create, { State } from 'zustand'
export interface PlayerListState extends State {
  players: string[]
  update(players: string[]): void
}

export const usePlayerListState = create<PlayerListState>((set) => ({
  players: [],
  update: (players) =>
    set((state) => {
      state.players = players
    }),
}))
