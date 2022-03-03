import { PetNpc } from '../../networking/schemas/PetNpc'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { lerp } from '../behaviors/lerp'
import { useSceneState } from '../use-scene-state'
import { MovableEntity } from './movable'
import { PlayerEntity } from './player'
import { NamePlugin } from './plugins/name'

export class PetEntity extends MovableEntity<PetNpc> {
  rectangle: Phaser.GameObjects.Rectangle
  namePlugin: NamePlugin = new NamePlugin(this.scene)

  owner: PlayerEntity

  create() {
    this.namePlugin.create(
      this.owner.model.name + "'s Pet",
      this.position.x,
      this.position.y,
      'rgba(200, 200, 120)'
    )
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.position.x,
      this.position.y,
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#8af').color
    )
    this.rectangle.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 64),
      Phaser.Geom.Rectangle.Contains
    )
    this.rectangle.on('pointerdown', (e) => {
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      e.downElement.focus()
      if (app.target === this) {
        const scene = useSceneState.getState().scene
        app.rooms[scene].send('character:move:destination', {
          x: this.position.x,
          y: this.position.y,
        })
      }
      app.target = this
    })
    this.rectangle.setDepth(Math.round(this.rectangle.y))
    this.rectangle.setOrigin(0.5, 0.75)
    this.scene.add.existing(this.rectangle)
  }

  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
    if (this.rectangle.active) {
      if (
        this.rectangle.x !== this.position.x ||
        this.rectangle.y !== this.position.y
      ) {
        const { newX, newY } = this.lerpFrom(this.rectangle.x, this.rectangle.y)
        this.rectangle.setPosition(newX, newY)
      }
      this.rectangle.setDepth(Math.round(this.rectangle.y))
    }
    if (app.target === this) {
      this.rectangle.setStrokeStyle(
        4,
        Phaser.Display.Color.HexStringToColor('#aaf').color,
        0.5
      )
    } else {
      this.rectangle.setStrokeStyle(0)
    }
    this.namePlugin.update(this.rectangle.x, this.rectangle.y)
  }
  destroy() {
    super.destroy()
    this.rectangle?.destroy()
    this.namePlugin.destroy()
  }
}
