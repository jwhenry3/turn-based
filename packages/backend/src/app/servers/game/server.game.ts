import './polyfill/polyfill'
import 'phaser'

export class ServerGame extends Phaser.Game {
  constructor(
    scene:
      | Phaser.Scene
      | Phaser.Scene[]
      | Phaser.Types.Scenes.SettingsConfig
      | Phaser.Types.Scenes.SettingsConfig[]
      | Phaser.Types.Scenes.CreateSceneFromObjectConfig
      | Phaser.Types.Scenes.CreateSceneFromObjectConfig[]
      | Function
      | Function[]
  ) {
    super({
      type: Phaser.HEADLESS,
      width: 1280,
      height: 720,
      banner: false,
      audio: { noAudio: true },
      scene: scene,
      fps: {
        target: 30,
      },
      physics: {
        default: 'arcade',
      },
    })
    console.log('Game Created')
  }
}
