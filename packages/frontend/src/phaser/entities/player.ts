import { Character } from '../../networking/schemas/Character'
import { app } from '../../ui/app'
import { useSceneState } from '../use-scene-state'
import { MovableEntity } from './movable'
import { PetEntity } from './pet'
import { InputPlugin } from './plugins/input'

export class PlayerEntity extends MovableEntity<Character> {
  inputPlugin: InputPlugin

  battleId?: string
  pet?: PetEntity

  hasCreated = false

  get isLocalPlayer() {
    return this.model.currentClientId === this.scene.connector.room.sessionId
  }

  create() {
    if (this.isLocalPlayer) {
      this.inputPlugin = new InputPlugin(this.scene.input, this)
      this.inputPlugin.create()
    }
    this.setPosition(this.model.position.x, this.model.position.y)
    this.namePlugin.create(this.model.name)
    this.rectanglePlugin.create()

    this.add(this.namePlugin.text)
    this.add(this.rectanglePlugin.rectangle)

    this.handleClick(() => {
      if (this.model.battleId) {
        this.scene.connector.room.send('character:battle:join', {
          battleId: this.model.battleId,
        })
        return
      }
      const scene = useSceneState.getState().scene
      app.rooms[scene].send('character:move:destination', {
        x: this.x,
        y: this.y,
      })
    })
    this.setDepth(Math.round(this.y + 32))
    if (this.isLocalPlayer) {
      app.character = this.model
      // console.log(this.model.stats.maxMp.toJSON())
      app.updates.next('character:stats')
      // console.log(this.x, this.y)
      this.scene.cameras.main.startFollow(this, false, 0.05, 0.05)
      this.scene.cameras.main.setDeadzone(128, 128)
      this.scene.cameras.main.setZoom(1)
      this.inputPlugin.create()
      this.inputPlugin.onChange = ([horizontal, vertical]) => {
        this.scene.connector.room.send('character:move', {
          horizontal,
          vertical,
        })
      }
    }
    if (this.model.pet) {
      // console.log('added pet 1')
      this.pet = new PetEntity(this.model.pet, this.scene)
      this.pet.owner = this
      this.scene.add.existing(this.pet)
    }
    this.model.listen('pet', (pet, previous) => {
      if (pet && !previous) {
        // console.log('added pet 2')
        this.pet = new PetEntity(pet, this.scene)
        this.pet.owner = this
        this.scene.add.existing(this.pet)
      } else if (!pet && previous) {
        this.pet.destroy()
        this.pet = undefined
      }
    })
  }
  lastWidth = 1600

  preUpdate() {
    if (!this.rectanglePlugin.rectangle) this.create()
    if (this.isLocalPlayer) {
      if (
        this.model.position.destinationX &&
        this.model.position.destinationY
      ) {
        this.scene.destinationPointer.setPosition(
          this.model.position.destinationX,
          this.model.position.destinationY
        )
        this.scene.destinationPointer.setVisible(true)
      } else {
        this.scene.destinationPointer.setVisible(false)
      }
    }
    if (this.x !== this.model.position.x || this.y !== this.model.position.y) {
      const { newX, newY } = this.lerpTo(
        this.model.position.x,
        this.model.position.y
      )
      this.setPosition(newX, newY)
    }
    this.setDepth(Math.round(this.y + 32))

    if (this.model.isInBattle) {
      if (this.pet?.visible === true) {
        this.pet.setVisible(false)
      }
    } else {
      if (this.pet?.visible === false) {
        this.pet.setVisible(true)
      }
    }
    this.rectanglePlugin.update()
    this.namePlugin.update()
    this.inputPlugin?.update()
    this.handleJump()
  }
  destroy() {
    super.destroy()
  }
}
