import { lerp } from '../../behaviors/lerp'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'
import { RectanglePlugin } from '../plugins/rectangle'
import { BattlePosition } from './battle-position'

export class BattleEntity<T> extends Phaser.GameObjects.Container {
  rectanglePlugin: RectanglePlugin = new RectanglePlugin(this.scene, this)
  namePlugin: NamePlugin = new NamePlugin(this.scene, this)

  animateJump = false
  falling = false
  jumpMax = 32
  jumpCurrent = 0
  parentContainer: BattlePosition
  constructor(
    public model: T,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(scene)
  }

  create() {}
  timer = 0
  jumping = false

  handleJump() {
    if (this.animateJump || this.jumping) {
      this.jumping = true
      this.animateJump = false
      const nextValue = Math.sin(Math.PI * this.timer * 10) * this.jumpMax
      this.timer += 0.001
      if (nextValue > 0) {
        if (this.jumpCurrent < nextValue) {
          this.falling = true
        }
        this.jumpCurrent = nextValue
        this.rectanglePlugin.rectangle.setPosition(0, -this.jumpCurrent)
      }
      if (nextValue <= 0 && nextValue < this.jumpCurrent) {
        this.jumping = false
        this.falling = false
        this.jumpCurrent = 0
        this.timer = 0
      }
    }
  }
}
