import { Npc } from '../../networking/schemas/Npc'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { useSceneState } from '../use-scene-state'
import { MovableEntity } from './movable'

export class NpcEntity extends MovableEntity<Npc> {
  create() {
    this.rectanglePlugin.color = '#f80'
    this.setPosition(this.model.position.x, this.model.position.y)
    this.namePlugin.create(this.model.name, 'rgba(255, 120, 0)')
    this.shadowPlugin.create()
    this.rectanglePlugin.create()
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 64),
      Phaser.Geom.Rectangle.Contains
    )
    this.handleClick(() => {
      const scene = useSceneState.getState().scene
      app.rooms[scene].send('character:move:destination', {
        x: this.x,
        y: this.y,
      })
    })
    this.add(this.shadowPlugin.shadow)
    this.add(this.rectanglePlugin.rectangle)
    this.add(this.namePlugin.text)
  }

  preUpdate() {
    if (!this.rectanglePlugin.rectangle) this.create()
    if (this.visible && this.model.despawned) {
      this.setVisible(false)
    }
    if (!this.visible && !this.model.despawned) {
      this.setVisible(true)
    }
    if (this.x !== this.model.position.x || this.y !== this.model.position.y) {
      const { newX, newY } = this.lerpTo(
        this.model.position.x,
        this.model.position.y
      )
      this.setPosition(newX, newY)
    }
    this.rectanglePlugin.update()
    this.namePlugin.update()
    this.setDepth(Math.round(this.y + 32))
  }
}
