import { NpcData } from '../rooms/fixture.models'
import { Npc, Character, PositionData } from '../schemas/schemas'
import { NpcChase } from './plugins/npc-chase'
import { NpcFollow } from './plugins/npc-follow'
import { NpcWander } from './plugins/npc-wander'

export class NpcInput {
  wander: NpcWander
  chase: NpcChase
  follow: NpcFollow
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
    this.wander = new NpcWander(this)
    this.chase = new NpcChase(this)
    this.follow = new NpcFollow(this)
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
  handleCollisions() {
    if (this.npc.hash) {
      this.npc.hash.find(this.collideRange, (selector) => {
        if (
          selector.entity instanceof Character &&
          !selector.entity.isInBattle
        ) {
          this.onPlayerCollide(selector.entity)
          if (this.data.triggersBattle || this.data.despawnOnPlayerCollision) {
            this.despawn()
          }
        }
      })
    }
  }

  async update() {
    if (!this.npc.despawned) {
      this.follow.execute()
      this.chase.execute()
      this.wander.execute()
      this.handleCollisions()
    } else {
      if (this.npc.respawnTimer > 0) {
        this.npc.respawnTimer--
      } else {
        this.respawn()
      }
    }
  }
}
