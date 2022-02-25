import create, { State } from 'zustand'
export interface NpcListState extends State {
  npcs: string[]
  update(players: string[]): void
}

export const useNpcListState = create<NpcListState>((set) => ({
  npcs: [],
  update: (npcs) =>
    set((state) => {
      state.npcs = npcs
    }),
}))
