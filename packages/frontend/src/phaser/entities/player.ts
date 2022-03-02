import { Character } from '../../networking/schemas/Character'
import { app } from '../../ui/app'
import { blurAll } from '../behaviors/blurAll'
import { lerp } from '../behaviors/lerp'
import { MovableEntity } from './movable'
import { PetEntity } from './pet'

export class PlayerEntity extends MovableEntity<Character> {
  rectangle: Phaser.GameObjects.Rectangle

  battleId?: string
  pet?: PetEntity

  get isLocalPlayer() {
    return this.model.currentClientId === this.scene.connector.room.sessionId
  }

  create() {
    console.log('player create')
    // Using a circle for collision
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.position.x,
      this.position.y,
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#55f').color
    )
    this.rectangle.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 64),
      Phaser.Geom.Rectangle.Contains
    )
    this.rectangle.on('pointerdown', (e) => {
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      if (app.selected === this) {
        if (this.model.battleId) {
          this.scene.connector.room.send('character:battle:join', {
            battleId: this.model.battleId,
          })
          return
        }
        app.movement.mouseDestination = {
          x: this.position.x,
          y: this.position.y,
        }
      }
      app.selected = this
    })
    this.rectangle.setDepth(Math.round(this.rectangle.y))
    this.rectangle.setOrigin(0.5, 0.75)
    this.scene.add.existing(this.rectangle)
    if (this.isLocalPlayer) {
      this.scene.cameras.main.startFollow(this.rectangle, false, 0.05, 0.05)
      this.scene.cameras.main.setDeadzone(128, 128)
      this.scene.cameras.main.setZoom(1)
      app.movement.create(this.scene.input)
      app.movement.onChange = ([horizontal, vertical]) => {
        this.scene.connector.room.send('character:move', {
          horizontal,
          vertical,
        })
      }
    }
    if (this.model.pet) {
      console.log('added pet 1')
      this.pet = new PetEntity(this.model.pet, this.scene)
      this.scene.add.existing(this.pet)
    }
    this.model.listen('pet', (pet, previous) => {
      if (pet && !previous) {
        console.log('added pet 2')
        this.pet = new PetEntity(pet, this.scene)
        this.scene.add.existing(this.pet)
      } else if (!pet && previous) {
        this.pet.destroy()
        this.pet = undefined
      }
    })
  }
  lastWidth = 1600
  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
    if (this.lastWidth !== window.innerWidth) {
      // this.scene.cameras.main.setZoom(window.innerWidth / 1600)
    }
    if (this.isLocalPlayer && this.rectangle) {
      app.movement.update(this.scene.input, this.rectangle)
    }
    if (
      this.rectangle.x !== this.position.x ||
      this.rectangle.y !== this.position.y
    ) {
      const newX = lerp(this.rectangle.x, this.position.x, 0.2)
      const newY = lerp(this.rectangle.y, this.position.y, 0.2)
      this.rectangle.setPosition(newX, newY)
    }
    this.rectangle.setDepth(Math.round(this.rectangle.y))
    if (app.selected === this) {
      this.rectangle.setStrokeStyle(
        4,
        Phaser.Display.Color.HexStringToColor('#aaf').color,
        0.5
      )
    } else {
      this.rectangle.setStrokeStyle(0)
    }
    if (this.model.isInBattle) {
      if (this.pet?.rectangle?.visible === true) {
        this.pet.rectangle.setVisible(false)
      }
      this.rectangle.setFillStyle(
        Phaser.Display.Color.HexStringToColor('#f50').color
      )
    } else {
      if (this.pet?.rectangle?.visible === false) {
        this.pet.rectangle.setVisible(true)
      }
      this.rectangle.setFillStyle(
        Phaser.Display.Color.HexStringToColor('#55f').color
      )
    }
  }
  destroy() {
    super.destroy()
    this.rectangle?.destroy()
  }
}
