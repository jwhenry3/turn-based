import create, { State } from 'zustand'
import { BattleScene } from './scenes/battle.scene'
export interface BattleState extends State {
  battle: BattleScene
  tick: number
  update(value: BattleScene): void
}

export const useBattle = create<BattleState>((set) => ({
  battle: undefined,
  tick: 0,
  update: (value) =>
    set((state) => {
      state.battle = value
    }),
}))
