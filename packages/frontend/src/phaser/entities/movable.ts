import { Position } from '../../networking/schemas/Position'
import { lerp } from '../behaviors/lerp'
import { NetworkedScene } from '../scenes/networked.scene'

export class MovableEntity<T extends { position: Position }> extends Phaser
  .GameObjects.GameObject {
  constructor(public model: T, public scene: NetworkedScene) {
    super(scene, 'sprite')
  }
  get position() {
    return this.model?.position || { x: -1, y: -1 }
  }

  lerpFrom(x: number, y: number) {
    const diffX = Math.abs(this.position.x - x)
    const diffY = Math.abs(this.position.y - y)
    let newX = x
    let newY = y
    if (diffX < 1) {
      newX = this.position.x
    } else {
      newX = lerp(x, this.position.x, 0.05)
    }
    if (diffY < 1) {
      newY = this.position.y
    } else {
      newY = lerp(y, this.position.y, 0.05)
    }
    return {newX, newY}
  }
}
