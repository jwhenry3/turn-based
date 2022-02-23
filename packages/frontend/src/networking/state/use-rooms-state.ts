import create, { State } from 'zustand'

export interface RoomsState extends State {
  regions: Record<string, any[]>
  setRoomsFor(region: string, rooms: any[]): void
}

export const useRoomsState = create<RoomsState>((set) => ({
  regions: {},
  setRoomsFor(region, rooms = []) {
    set((state) => {
      state.regions[region] = rooms
    })
  },
}))
