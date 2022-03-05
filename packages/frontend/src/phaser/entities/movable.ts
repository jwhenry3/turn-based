import { Position } from '../../networking/schemas/Position'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { lerp } from '../behaviors/lerp'
import { NetworkedScene } from '../scenes/networked.scene'
import { useSceneState } from '../use-scene-state'
import { NamePlugin } from './plugins/name'
import { RectanglePlugin } from './plugins/rectangle'

export class MovableEntity<
  T extends { position: Position; battleId?: string }
> extends Phaser.GameObjects.Container {
  rectanglePlugin: RectanglePlugin = new RectanglePlugin(this.scene, this)
  namePlugin: NamePlugin = new NamePlugin(this.scene, this)

  constructor(public model: T, public scene: NetworkedScene) {
    super(scene)
  }

  setPosition(x: number, y: number, z?: number, w?: number) {
    this.x = x
    this.y = y
    return this
  }
  handleClick(afterSelected: () => void) {
    this.rectanglePlugin.rectangle.on('pointerdown', (e) => {
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      if (app.selected === this) {
        afterSelected()
      }
      app.selected = this
    })
  }

  lerpTo(x: number, y: number) {
    const diffX = Math.abs(x - this.x)
    const diffY = Math.abs(y - this.y)
    let newX = this.x
    let newY = this.y
    if (diffX < 1) {
      newX = x
    } else {
      newX = lerp(this.x, x, 0.05)
    }
    if (diffY < 1) {
      newY = y
    } else {
      newY = lerp(this.y, y, 0.05)
    }
    return { newX, newY }
  }
}
