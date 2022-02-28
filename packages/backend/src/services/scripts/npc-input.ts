import { NpcData } from '../rooms/fixture.models'
import Npc, { Character, PositionData } from '../schemas/schemas'
import { NpcChase } from './npc-chase'
import { NpcWander } from './npc-wander'

export class NpcInput {
  wander: NpcWander
  chase: NpcChase
  get collideRange() {
    return {
      x: this.npc.position.x - 16,
      y: this.npc.position.y - 16,
      width: 32,
      height: 32,
    }
  }

  onPlayerCollide = (player: Character) => {}

  constructor(
    public npc: Npc,
    public data: NpcData,
    public movementUpdates: PositionData[]
  ) {
    this.wander = new NpcWander(npc, data, movementUpdates)
    this.chase = new NpcChase(npc, data, movementUpdates, this.wander)
    this.npc.position.speed = 3
  }

  despawn() {
    this.npc.despawned = true
    this.npc.respawnTimer = this.npc.respawnTime
    this.npc.position.x = this.data.x
    this.npc.position.y = this.data.y
    this.chase.stopChase()
    this.wander.stopWander()
  }

  respawn() {
    this.npc.despawned = false
  }

  async update() {
    if (!this.npc.despawned) {
      this.chase.execute()
      if (this.data.canWander && !this.chase.chaseTarget) {
        this.wander.execute()
      }

      this.npc.hash.find(this.collideRange, (selector) => {
        if (selector.entity instanceof Character) {
          this.onPlayerCollide(selector.entity)
          if (this.data.triggersBattle || this.data.despawnOnPlayerCollision) {
            this.despawn()
          }
        }
      })
    } else {
      if (this.npc.respawnTimer > 0) {
        this.npc.respawnTimer--
      } else {
        this.respawn()
      }
    }
  }
}
