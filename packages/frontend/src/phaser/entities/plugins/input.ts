import { app } from '../../../ui/app'
import { NetworkedScene } from '../../scenes/networked.scene'
import { PlayerEntity } from '../player'

export class InputPlugin {
  movement = [0, 0]
  keyMap = {
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right',
    ' ': 'jump',
  }
  keys: Record<string, boolean> = {
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
  }

  mouseCooldown = 20
  mouseTick = 0

  input: Phaser.Input.InputPlugin

  constructor(public scene: NetworkedScene, public owner: PlayerEntity) {
    this.input = this.scene.input
  }

  onChange = (axis: [number, number]) => null

  onKeyDown = (e) => {
    if (this.keyMap[e.key] && app.focusedUi.length === 0) {
      this.keys[this.keyMap[e.key]] = true
    }
  }
  onKeyUp = (e) => {
    if (this.keyMap[e.key]) {
      this.keys[this.keyMap[e.key]] = false
    }
  }
  create() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    this.onChange = ([horizontal, vertical]) => {
      this.scene.connector.room.send('character:move', {
        horizontal,
        vertical,
      })
    }
  }

  lastDestX?: number = undefined
  lastDestY?: number = undefined
  lastVelX = 0
  lastVelY = 0

  moveTick = 0
  update() {
    const destX = this.owner.destX
    const destY = this.owner.destY
    const { x, y } = this.owner

    const [velocityX, velocityY] = this.owner.updateVelocityForDestination(
      destX,
      destY
    )
    if (
      Math.round(this.owner.x) !== Math.round(this.owner.model.position.x) ||
      Math.round(this.owner.y) !== Math.round(this.owner.model.position.y)
    ) {
      if (this.moveTick === 0 || this.moveTick % 30 === 0) {
        this.scene.connector.room.send('character:move', {
          x: Math.round(x),
          y: Math.round(y),
        })
      }
      this.moveTick++
    }
    if (
      velocityX !== this.owner.model.position.velocityX ||
      velocityY !== this.owner.model.position.velocityY
    ) {
      this.owner.body.setVelocity(velocityX, velocityY)
      this.scene.connector.room.send('character:velocity', {
        x: velocityX,
        y: velocityY,
      })
    }
    this.owner.moving = Boolean(velocityX || velocityY)

    if (destX !== this.lastDestX || destY !== this.lastDestY) {
      this.lastDestX = destX
      this.lastDestY = destY
      if (destX && destY) {
        this.scene.destinationPointer.setPosition(destX, destY)
        this.scene.destinationPointer.setVisible(true)
      } else {
        this.scene.destinationPointer.setVisible(false)
      }
    }
  }
  destroy() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
}
