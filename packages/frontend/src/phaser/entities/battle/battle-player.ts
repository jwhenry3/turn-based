import { BattlePlayer } from '../../../networking/schemas/BattlePlayer'
import { Character } from '../../../networking/schemas/Character'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'
import { RectanglePlugin } from '../plugins/rectangle'
import { BattleEntity } from './battle-entity'
import { BattleScenePet } from './battle-pet'

export class BattleScenePlayer extends BattleEntity<BattlePlayer> {
  pet: BattleScenePet

  constructor(
    public character: Character,
    public model: BattlePlayer,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(model, scene, connector)
  }

  get isLocalPlayer() {
    return this.character.currentClientId === this.connector.room.sessionId
  }
  getBattleLocation(type: string) {
    return this.scene.battleLocations[type][this.model.battleLocation]
  }
  create() {
    this.setPosition(...this.getBattleLocation('players'))
    this.namePlugin.create(this.character.name)
    this.rectanglePlugin.create()
    this.add(this.namePlugin.text)
    this.add(this.rectanglePlugin.rectangle)
    this.setDepth(Math.round(this.y))
    const player = this.model
    if (player.pet) {
      this.pet = new BattleScenePet(
        this,
        player.pet,
        this.scene,
        this.connector
      )
      this.pet.owner = this
      this.scene.add.existing(this.pet)
    }
    this.rectanglePlugin.rectangle.on('pointerdown', (e) => {
      console.log('Selected!', this.character.name)
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      e.downElement.focus()
      app.target = this.character
      app.updates.next('target:stats')
    })
    console.log('created!')
  }

  preUpdate() {
    if (!this.rectanglePlugin.rectangle) this.create()
    this.rectanglePlugin.update()
    this.namePlugin.update()
  }
}
