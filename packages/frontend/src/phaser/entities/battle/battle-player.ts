import { BattlePlayer } from '../../../networking/schemas/BattlePlayer'
import { Character } from '../../../networking/schemas/Character'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { BattleScenePet } from './battle-pet'

export class BattleScenePlayer extends Phaser.GameObjects.GameObject {
  rectangle: Phaser.GameObjects.Rectangle
  character: Character

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
    // console.log(this.model.battleLocation, location)
    this.rectangle = this.scene.add.rectangle(
      location[0],
      location[1],
      32,
      64,
      Phaser.Display.Color.HexStringToColor('#55f').color
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
  }

  preUpdate() {
    if (!this.rectangle) {
      this.create()
    }
  }

  destroy() {
    super.destroy()
    this.rectangle.destroy()
    this.pet?.destroy()
  }
}
