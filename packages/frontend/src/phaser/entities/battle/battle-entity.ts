import { lerp } from '../../behaviors/lerp'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'
import { RectanglePlugin } from '../plugins/rectangle'
import { BattlePosition } from './battle-position'

export class BattleEntity<T> extends Phaser.GameObjects.Container {
  rectanglePlugin: RectanglePlugin = new RectanglePlugin(this.scene, this)
  namePlugin: NamePlugin = new NamePlugin(this.scene, this)

  attacking?: BattleEntity<any>

  retreat = false

  parentContainer: BattlePosition

  constructor(
    public model: T,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(scene)
  }

  create() {}

  lerpTo(x: number, y: number) {
    const diffX = Math.abs(x - this.parentContainer.x)
    const diffY = Math.abs(y - this.parentContainer.y)
    let newX = this.parentContainer.x
    let newY = this.parentContainer.y
    if (diffX < 1) {
      newX = x
    } else {
      newX = lerp(this.parentContainer.x, x, 0.05)
    }
    if (diffY < 1) {
      newY = y
    } else {
      newY = lerp(this.parentContainer.y, y, 0.05)
    }
    return { newX, newY }
  }

  onFinishAttack = () => {}

  handleAttacks() {
    if (this.attacking) {
      if (!this.retreat) {
        const target = this.attacking.parentContainer
        let offset = 48
        if (target.x > this.scene.width / 2) {
          offset = -48
        }
        const { newX, newY } = this.lerpTo(
          target.originalX + offset,
          target.originalY
        )
        this.parentContainer.setPosition(newX, newY)
        if (
          Math.abs(this.parentContainer.x - (target.originalX + offset)) < 4 &&
          Math.abs(this.parentContainer.y - target.originalY) < 4
        ) {
          this.retreat = true
        }
      } else {
        const target = this.parentContainer as BattlePosition
        const { newX, newY } = this.lerpTo(target.originalX, target.originalY)
        this.parentContainer.setPosition(newX, newY)
        if (
          Math.abs(this.parentContainer.x - target.originalX) < 4 &&
          Math.abs(this.parentContainer.y - target.originalY) < 4
        ) {
          this.retreat = false
          this.attacking = undefined
          this.onFinishAttack()
        }
      }
    }
  }
}
