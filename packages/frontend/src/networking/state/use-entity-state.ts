import create, { State } from 'zustand'
export interface EntityState extends State {
  entities: { players: Record<string, any>; npcs: Record<string, any> }
  update(entities: {
    players: Record<string, any>
    npcs: Record<string, any>
  }): void
}
export const useEntityState = create<EntityState>((set) => ({
  entities: { players: {}, npcs: {} },
  update: (entities) =>
    set((state) => {
      state.entities = entities
    }),
}))
