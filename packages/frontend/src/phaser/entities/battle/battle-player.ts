import { BattlePlayer } from '../../../networking/schemas/BattlePlayer'
import { Character } from '../../../networking/schemas/Character'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'
import { BattleScenePet } from './battle-pet'

export class BattleScenePlayer extends Phaser.GameObjects.GameObject {
  rectangle: Phaser.GameObjects.Rectangle
  character: Character
  namePlugin: NamePlugin = new NamePlugin(this.scene)

  pet: BattleScenePet

  battleLocation: number = 0

  constructor(
    public model: BattlePlayer,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(scene, 'sprite')
  }

  get isLocalPlayer() {
    return this.character.currentClientId === this.connector.room.sessionId
  }

  create() {
    const location =
      this.scene.battleLocations.players[this.model.battleLocation]
    this.namePlugin.create(
      this.character.name + "'s Pet",
      location[0],
      location[1]
    )
    // console.log(this.model.battleLocation, location)
    this.rectangle = this.scene.add.rectangle(
      location[0],
      location[1],
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#55f').color
    )
    this.rectangle.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 32, 64),
      Phaser.Geom.Rectangle.Contains
    )
    this.rectangle.setDepth(
      Math.round(this.rectangle.y - this.rectangle.height)
    )
    this.rectangle.setOrigin(0.5, 0.75)
    const player = this.model
    if (player.pet) {
      const pet = new BattleScenePet(player.pet, this.scene, this.connector)
      this.scene.players[player.characterId].pet = pet
      pet.owner = this.scene.players[player.characterId]
      this.scene.add.existing(pet)
    }
    this.rectangle.on('pointerdown', (e) => {
      console.log('Selected!', this.character.name)
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      e.downElement.focus()
      app.target = this.character
      app.updates.next('target:stats')
    })
  }

  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
    if (app.target === this.character) {
      this.rectangle.setStrokeStyle(
        4,
        Phaser.Display.Color.HexStringToColor('#aaf').color,
        0.5
      )
    } else {
      this.rectangle.setStrokeStyle(0)
    }
    this.namePlugin.update(this.rectangle.x, this.rectangle.y)
  }

  destroy() {
    super.destroy()
    this.rectangle.destroy()
    this.pet?.destroy()
    this.namePlugin.destroy()
  }
}
