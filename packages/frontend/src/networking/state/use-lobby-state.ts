import create, { State } from 'zustand'
export interface LobbyState extends State {
  account: any
  update(account: any): void
}
export const useLobbyState = create<LobbyState>((set) => ({
  account: undefined,
  update: (account) =>
    set((state) => {
      state.account = account
    }),
}))
