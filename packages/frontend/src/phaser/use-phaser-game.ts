import create, { State } from 'zustand'
export interface PhaserGameState extends State {
  game: Phaser.Game
  update(game: Phaser.Game): void
}

export const usePhaserGame = create<PhaserGameState>((set) => ({
  game: undefined,
  update: (game) =>
    set((state) => {
      state.game = game
    }),
}))
