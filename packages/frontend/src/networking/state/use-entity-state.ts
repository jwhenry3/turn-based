import create, { State } from 'zustand'
export interface LobbyState extends State {
  entities: Record<string, any>
  update(entities: Record<string, any>): void
}
export const useEntityState = create<LobbyState>((set) => ({
  entities: {},
  update: (entities) =>
    set((state) => {
      state.entities = entities
    }),
}))
