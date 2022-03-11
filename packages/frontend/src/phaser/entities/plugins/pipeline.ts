import { Plugin } from './plugin.interface'
export interface PluginPipeline {
  plugins: Plugin[]
  addToParent(parent: Phaser.GameObjects.Container): void
  create(): void
  update(): void
  destroy(): void
}
export function createPluginPipeline(plugins: Plugin[]) {
  let hasCreated = false
  return {
    plugins,
    addToParent(parent: Phaser.GameObjects.Container) {
      parent.add(this.plugins.filter(p => !!p.gameObject).map((p) => p.gameObject))
    },
    create() {
      hasCreated = true
      this.plugins.forEach((p) => (p.create ? p.create() : undefined))
    },
    update() {
      if (!hasCreated) this.create()
      this.plugins.forEach((p) => (p.update ? p.update() : undefined))
    },
    destroy() {
      this.plugins.forEach((p) => (p.destroy ? p.destroy() : undefined))
    },
  }
}
