import { NetworkedScene } from '../../scenes/networked.scene'
import { MovableEntity } from '../movable'

export class MovementPlugin {
  constructor(public scene: NetworkedScene, public owner: MovableEntity<any>) {}

  create() {
    this.owner.setDepth(Math.round(this.owner.y + 32))
  }

  update() {
    if (
      this.owner.x !== this.owner.model.position.x ||
      this.owner.y !== this.owner.model.position.y
    ) {
      const { newX, newY } = this.owner.lerpTo(
        this.owner.model.position.x,
        this.owner.model.position.y
      )
      this.owner.setPosition(newX, newY)
      this.owner.setDepth(Math.round(this.owner.y + 32))
    }
  }
}
