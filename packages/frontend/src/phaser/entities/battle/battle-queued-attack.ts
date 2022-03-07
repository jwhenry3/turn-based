import { lerp } from '../../behaviors/lerp'
import { BattleScene } from '../../scenes/battle.scene'
import { BattleEntity } from './battle-entity'
import { BattlePosition } from './battle-position'

export class BattleQueuedAttack {
  willRetreat = false
  retreating = false
  retreatDelay = 0
  hasStartedAction = false

  isRanged = false
  isMagic = false
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
  hasRan = false
  lerpTo(x: number, y: number) {
    let newX = lerp(this.entity.parentContainer.x, x, 0.08)
    let newY = lerp(this.entity.parentContainer.y, y, 0.08)
    return { newX, newY }
  }

  abilityDuration = 0

  update() {
    if (this.isMagic && !this.isRanged) {
      if (this.abilityDuration === 0) {
        this.entity.shadowPlugin.isGlowing = true
        this.target.shadowPlugin.isGlowing = true
        this.target.shadowPlugin.isTarget = true
        this.abilityDuration = this.durationAtTarget * 2
      }
      if (this.abilityDuration > 1) {
        this.abilityDuration--
      }
      if (this.abilityDuration === 1) {
        this.entity.shadowPlugin.isGlowing = false
        this.target.shadowPlugin.isGlowing = false
        this.target.shadowPlugin.isTarget = false
        this.complete()
      }
      return
    }
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
      const destinationX = this.isRanged
        ? this.scene.width / 2
        : target.originalX + offset
      const { newX, newY } = this.lerpTo(destinationX, target.originalY)
      this.entity.parentContainer.setPosition(newX, newY)
      if (
        Math.abs(this.entity.parentContainer.x - destinationX) < 4 &&
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
