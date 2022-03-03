import { Character, PositionData } from '../../schemas/schemas'
import { NpcInput } from '../npc-input'
import { NpcMovement } from './npc-movement'

export class NpcFollow extends NpcMovement {
  followTarget: Character
  tick = 0
  followRadius = 48
  shouldFollow = true

  get isFOllowing() {
    return !!this.followTarget
  }

  constructor(input: NpcInput) {
    super(input)
  }

  stopFollowing() {
    this.shouldFollow = false
    this.npc.position.speed = 3
  }
  startFollowing(target: Character) {
    this.followTarget = target
    this.npc.position.speed = 4
    this.shouldFollow = true
  }

  getMovementVector() {
    if (!this.followTarget) return
    this.moveTowards(this.followTarget.position, 48)
  }

  execute() {
    if (this.shouldFollow && this.followTarget) {
      this.moveTowards(this.followTarget.position, 48)
    }
  }
}
