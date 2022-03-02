import create, { State } from 'zustand'
export interface MapToggleState extends State {
  opened: boolean
  toggleOpen(value: boolean): void
}

export const useMapToggleState = create<MapToggleState>((set) => ({
  opened: false,
  toggleOpen: (value) =>
    set((state) => {
      state.opened = value
    }),
}))
