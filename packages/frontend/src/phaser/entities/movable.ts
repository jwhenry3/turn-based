import { Position } from '../../networking/schemas/Position'
import { NetworkedScene } from '../scenes/networked.scene'

export class MovableEntity<T extends { position: Position }> extends Phaser
  .GameObjects.GameObject {
  constructor(public model: T, public scene: NetworkedScene) {
    super(scene, 'sprite')
  }
  get position() {
    return this.model?.position || { x: -1, y: -1 }
  }
}
