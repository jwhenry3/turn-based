import { PetNpc } from '../../networking/schemas/PetNpc'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { useSceneState } from '../use-scene-state'
import { MovableEntity } from './movable'
import { PlayerEntity } from './player'

export class PetEntity extends MovableEntity<PetNpc> {
  owner: PlayerEntity

  create() {
    this.rectanglePlugin.color = '#8af'
    this.setPosition(this.model.position.x, this.model.position.y)
    this.namePlugin.create(
      this.owner.model.name + "'s Pet",
      'rgba(120, 150, 50, 0.8)'
    )
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
    this.add(this.namePlugin.text)
    this.add(this.rectanglePlugin.rectangle)
  }

  preUpdate() {
    if (!this.rectanglePlugin.rectangle) this.create()
    if (this.x !== this.model.position.x || this.y !== this.model.position.y) {
      const { newX, newY } = this.lerpTo(
        this.model.position.x,
        this.model.position.y
      )
      this.setPosition(newX, newY)
    }
    this.rectanglePlugin.update()
    this.namePlugin.update()
  }
}
