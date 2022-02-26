import { app } from '../../ui/app'

export class BackgroundScene extends Phaser.Scene {
  create() {
    this.scale.on('resize', (gameSize) => {
      this.cameras.resize(gameSize.width, gameSize.height)
    })
    app.movement.create(this.input)
  }

  update() {}
}
