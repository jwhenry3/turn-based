export class Player extends Phaser.GameObjects.GameObject {
  rectangle: Phaser.GameObjects.Rectangle
  _position = { x: -1, y: -1 }
  get position() {
    return this._position
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
