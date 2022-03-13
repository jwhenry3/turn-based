import { NetworkedScene } from '../../scenes/networked.scene'
import { MovableEntity } from '../movable'
import { PlayerEntity } from '../player'

export class MovementPlugin {
  constructor(public scene: NetworkedScene, public owner: MovableEntity<any>) {}

  create() {
    this.owner.setDepth(Math.round(this.owner.y + 32))
  }

  update() {
    if (this.owner instanceof PlayerEntity) {
      this.owner.body.x = this.owner.model.position.x
      this.owner.body.y = this.owner.model.position.y
      this.owner.body.setVelocity(
        this.owner.model.position.velocityX,
        this.owner.model.position.velocityY
      )
      this.owner.setDepth(this.owner.y + 32)
      return
    }
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
