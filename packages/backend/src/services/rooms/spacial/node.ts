import { PositionData } from '../../schemas/schemas'

export class SpatialNode<T extends { position: PositionData }> {
  type: 'player' | 'npc'

  __b: any

  get range() {
    return {
      x: this.entity.position.x - 16,
      y: this.entity.position.y - 16,
      width: 32,
      height: 32,
    }
  }

  constructor(public entity: T) {}
}
