export interface Plugin {
  gameObject?: Phaser.GameObjects.GameObject
  create?:() => void
  update?: () => void
  destroy?: () => void
}
