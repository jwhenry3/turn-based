import { app } from '../../../ui/app'

export class InputPlugin {
  movement = [0, 0]

  keys: Record<string, Phaser.Input.Keyboard.Key> = {}

  mouseCooldown = 20
  mouseTick = 0

  constructor(public input: Phaser.Input.InputPlugin) {}

  onChange = (axis: [number, number]) => null

  create() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>
  }

  update() {
    const movement: [number, number] = [0, 0]
    if (app.gameHasFocus) {
      this.input.keyboard.enabled = true
      if (this.keys.left.isDown) {
        movement[0] = -1
      }
      if (this.keys.right.isDown) {
        movement[0] = 1
      }
      if (this.keys.up.isDown) {
        movement[1] = -1
      }
      if (this.keys.down.isDown) {
        movement[1] = 1
      }
    } else {
      this.input.keyboard.enabled = false
    }
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
    this.input.keyboard.removeAllKeys()
  }
}
