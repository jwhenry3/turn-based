export class MovementInput {
  movement = [0, 0]

  enabled = false
  keys: Record<string, Phaser.Input.Keyboard.Key> = {}

  onChange = (axis: [number, number]) => null

  create(input: Phaser.Input.InputPlugin) {
    this.keys = input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>
  }
  update(input: Phaser.Input.InputPlugin) {
    if (!this.enabled) {
      return
    }
    const movement = [0, 0]
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

    const pads = input.gamepad.getAll()
    if (pads.length > 0) {
      for (const pad of pads) {
        const x = pad.getAxisValue(0)
        const y = pad.getAxisValue(1)
        movement[0] = x
        movement[1] = y
      }
    }
    if (movement[0] !== this.movement[0] || movement[1] !== this.movement[1]) {
      this.movement = movement
      this.onChange(movement)
    }
  }
}
