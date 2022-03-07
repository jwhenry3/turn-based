import { app } from '../../../ui/app'
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

  constructor(
    public input: Phaser.Input.InputPlugin,
    public entity: PlayerEntity
  ) {}

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
  }

  update() {
    const movement: [number, number] = [0, 0]
    if (this.keys.left) {
      movement[0] = -1
    }
    if (this.keys.right) {
      movement[0] = 1
    }
    if (this.keys.up) {
      movement[1] = -1
    }
    if (this.keys.down) {
      movement[1] = 1
    }
    // if (this.keys.jump) {
    //   if (this.entity.jumpCurrent === 0) {
    //     // console.log('jump!')
    //     this.entity.animateJump = true
    //   }
    // }
    if (this.mouseTick > 0) {
      this.mouseTick--
    }

    const pads = this.input.gamepad.getAll()
    if (pads.length > 0) {
      for (const pad of pads) {
        const x = Math.round(pad.getAxisValue(0) * 1.5)
        const y = Math.round(pad.getAxisValue(1) * 1.5)
        if (x !== 0 || y !== 0) {
          movement[0] = x > 0 ? 1 : x < 0 ? -1 : 0
          movement[1] = y > 0 ? 1 : y < 0 ? -1 : 0
        }
      }
    }
    if (movement[0] !== this.movement[0] || movement[1] !== this.movement[1]) {
      this.movement = movement
      this.onChange(movement)
    }
  }
  destroy() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }
}
