import create, { State } from 'zustand'
export interface SceneState extends State {
  scene: string
  update(scene: string): void
}
export const useSceneState = create<SceneState>((set) => ({
  scene: '',
  update: (scene) =>
    set((state) => {
      state.scene = scene
    }),
}))
