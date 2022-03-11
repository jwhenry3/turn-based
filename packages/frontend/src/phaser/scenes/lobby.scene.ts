export class LobbyScene extends Phaser.Scene {
  preload() {
    this.load.spritesheet('entity', '/run.png', {
      frameWidth: 33,
      frameHeight: 57,
    })
  }
  create() {
    this.anims.create({
      key: 'stand',
      frameRate: 1,
      frames: this.anims.generateFrameNumbers('entity', { start: 0, end: 0 }),
      repeat: 0,
    })
    this.anims.create({
      key: 'jump',
      frameRate: 1,
      frames: this.anims.generateFrameNumbers('entity', { start: 7, end: 7 }),
      repeat: 0,
    })
    this.anims.create({
      key: 'run',
      frameRate: 8,
      frames: this.anims.generateFrameNumbers('entity', { start: 1, end: 6 }),
      repeat: -1,
    })
  }
}
