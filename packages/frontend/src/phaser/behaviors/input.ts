import { app } from '../../ui/app';

export class MovementInput {
  movement = [0, 0]

  enabled = false
  keys: Record<string, Phaser.Input.Keyboard.Key> = {}

  mouseDestination?: { x: number; y: number } = undefined

  mouseCooldown = 20
  mouseTick = 0

  onChange = (axis: [number, number]) => null

  create(input: Phaser.Input.InputPlugin) {
    this.keys = input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>
  }
  moveTowards(currentPosition: { x: number; y: number }, offset: number = 0) {
    if (!currentPosition) {
      return [0, 0]
    }
    const { x: currentX, y: currentY } = currentPosition
    const { x, y } = this.mouseDestination
    const diffX = Math.round(x - currentX)
    const diffY = Math.round(y - currentY)
    // give padding room so the npc doesn't layer over the player initially
    // todo: soften angle for more fluid turning
    const horizontal = diffX > offset ? 1 : diffX < -offset ? -1 : 0
    const vertical = diffY > offset ? 1 : diffY < -offset ? -1 : 0
    if (horizontal !== 0 || vertical !== 0) {
      return [horizontal, vertical]
    }
    this.mouseDestination = undefined
    return [0, 0]
  }

  update(input: Phaser.Input.InputPlugin, position: { x: number; y: number }) {
    if (!this.enabled) {
      return
    }
    const movement: [number, number] = [0, 0]
    if (this.mouseDestination) {
      const [x, y] = this.moveTowards(position, 4)
      movement[0] = x
      movement[1] = y
    }
    if (app.gameHasFocus) {
      if (this.keys.left.isDown) {
        movement[0] = -1
        this.mouseDestination = undefined
      }
      if (this.keys.right.isDown) {
        movement[0] = 1
        this.mouseDestination = undefined
      }
      if (this.keys.up.isDown) {
        movement[1] = -1
        this.mouseDestination = undefined
      }
      if (this.keys.down.isDown) {
        movement[1] = 1
        this.mouseDestination = undefined
      }
      if (input.activePointer.isDown && this.mouseTick === 0) {
        this.mouseTick = this.mouseCooldown
        input.activePointer.updateWorldPoint(input.scene.cameras.main)
        this.mouseDestination = {
          x: input.activePointer.worldX,
          y: input.activePointer.worldY,
        }
      }
    }
    if (this.mouseTick > 0) {
      this.mouseTick--
    }

    const pads = input.gamepad.getAll()
    if (pads.length > 0) {
      for (const pad of pads) {
        const x = Math.round(pad.getAxisValue(0) * 1.5)
        const y = Math.round(pad.getAxisValue(1) * 1.5)
        if (x !== 0 || y !== 0) {
          movement[0] = x > 0 ? 1 : x < 0 ? -1 : 0
          movement[1] = y > 0 ? 1 : y < 0 ? -1 : 0
          if (movement[0] !== 0 || movement[1] !== 0) {
            this.mouseDestination = undefined
          }
        }
      }
    }
    if (movement[0] !== this.movement[0] || movement[1] !== this.movement[1]) {
      this.movement = movement
      this.onChange(movement)
    }
  }
}
