import { lerp } from '../../behaviors/lerp'
import { BattleScene } from '../../scenes/battle.scene'
import { BattleEntity } from './battle-entity'
import { BattlePosition } from './battle-position'

export class BattleQueuedAttack {
  willRetreat = false
  retreating = false
  retreatDelay = 0
  hasStartedAction = false
  constructor(
    public scene: BattleScene,
    public entity: BattleEntity<any>,
    public target: BattleEntity<any>,
    public durationAtTarget: number,
    public abilityId: string
  ) {}

  complete() {
    this.retreatDelay = 0
    this.willRetreat = false
    this.retreating = false
    this.onComplete()
  }
  onComplete = () => {}

  lerpTo(x: number, y: number) {
    const diffX = Math.abs(x - this.entity.parentContainer.x)
    const diffY = Math.abs(y - this.entity.parentContainer.y)
    let newX = this.entity.parentContainer.x
    let newY = this.entity.parentContainer.y
    if (diffX < 1) {
      newX = x
    } else {
      newX = lerp(this.entity.parentContainer.x, x, 0.05)
    }
    if (diffY < 1) {
      newY = y
    } else {
      newY = lerp(this.entity.parentContainer.y, y, 0.05)
    }
    return { newX, newY }
  }
  update() {
    this.entity.handleJump()
    if (!this.hasStartedAction) {
      this.entity.animateJump = true
      this.hasStartedAction = true
    }
    if (this.willRetreat) {
      if (this.retreatDelay > 0) {
        this.retreatDelay--
        return
      }
      this.entity.animateJump = true
      this.retreating = true
      this.willRetreat = false
    }
    if (!this.retreating) {
      const target = this.target.parentContainer
      let offset = 48
      if (target.x > this.scene.width / 2) {
        offset = -48
      }
      const { newX, newY } = this.lerpTo(
        target.originalX + offset,
        target.originalY
      )
      this.entity.parentContainer.setPosition(newX, newY)
      if (
        Math.abs(this.entity.parentContainer.x - (target.originalX + offset)) <
          4 &&
        Math.abs(this.entity.parentContainer.y - target.originalY) < 4
      ) {
        this.willRetreat = true
        this.retreatDelay = this.durationAtTarget
      }
    } else {
      const target = this.entity.parentContainer as BattlePosition
      const { newX, newY } = this.lerpTo(target.originalX, target.originalY)
      this.entity.parentContainer.setPosition(newX, newY)
      if (
        Math.abs(this.entity.parentContainer.x - target.originalX) < 4 &&
        Math.abs(this.entity.parentContainer.y - target.originalY) < 4
      ) {
        this.complete()
      }
    }
  }
}
