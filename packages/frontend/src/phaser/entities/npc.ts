import { Npc } from '../../networking/schemas/Npc'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { useSceneState } from '../use-scene-state'
import { MovableEntity } from './movable'
import { NamePlugin } from './plugins/name'

export class NpcEntity extends MovableEntity<Npc> {
  rectangle: Phaser.GameObjects.Rectangle
  namePlugin: NamePlugin = new NamePlugin(this.scene)

  create() {
    this.namePlugin.create(this.model.name, this.position.x, this.position.y, 'rgba(255, 120, 0)')
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.position.x,
      this.position.y,
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#ff8822').color
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
    if (this.rectangle.active && this.model.despawned) {
      this.rectangle.setActive(false)
      this.rectangle.setVisible(false)
      this.namePlugin.setVisible(false)
    }
    if (!this.rectangle.active && !this.model.despawned) {
      this.rectangle.setActive(true)
      this.rectangle.setVisible(true)
      this.namePlugin.setVisible(true)
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
        Phaser.Display.Color.HexStringToColor('#fa5').color,
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
