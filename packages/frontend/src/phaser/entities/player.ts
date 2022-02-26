import { Character } from '../../networking/schemas/Character'

export class Player extends Phaser.GameObjects.GameObject {
  rectangle: Phaser.GameObjects.Rectangle

  model: Character

  get position() {
    return this.model?.position || { x: -1, y: -1 }
  }
  create() {
    // Using a circle for collision
    this.rectangle = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.position.x,
      this.position.y,
      32,
      60,
      Phaser.Display.Color.HexStringToColor('#00aa22').color
    )
  }

  update() {}
}
