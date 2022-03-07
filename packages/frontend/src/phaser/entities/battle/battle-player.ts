import { BattlePlayer } from '../../../networking/schemas/BattlePlayer'
import { Character } from '../../../networking/schemas/Character'
import { app } from '../../../ui/app'
import { blurAll } from '../../behaviors/blurAll'
import { lerp } from '../../behaviors/lerp'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'
import { RectanglePlugin } from '../plugins/rectangle'
import { BattleEntity } from './battle-entity'
import { BattleScenePet } from './battle-pet'
import { BattlePosition } from './battle-position'

export class BattleScenePlayer extends BattleEntity<BattlePlayer> {
  pet: BattleScenePet
  petPosition: BattlePosition

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
  getBattleLocation() {
    return this.scene.leftPositions[this.model.battleLocation]
  }
  create() {
    this.setPosition(0, 0)
    this.namePlugin.create(this.character.name)
    this.shadowPlugin.create()
    this.rectanglePlugin.create()

    this.add(this.shadowPlugin.shadow)
    this.add(this.rectanglePlugin.rectangle)
    this.add(this.namePlugin.text)
    this.setDepth(this.y)
    const player = this.model
    if (player.pet) {
      this.pet = new BattleScenePet(
        this,
        player.pet,
        this.scene,
        this.connector
      )
      const container = new BattlePosition(
        this.scene,
        this.parentContainer.x,
        this.parentContainer.y
      )
      container.originalY = this.parentContainer.y + 32
      if (this.scene.isMobilePortrait()) {
        container.originalX = this.parentContainer.x - 40
      } else {
        container.originalX = this.parentContainer.x - 64
      }
      container.setPosition(container.originalX, container.originalY)
      container.setDepth(container.y)
      this.scene.add.existing(this.pet)
      container.add(this.pet)
      this.scene.add.existing(container)
      this.pet.owner = this
    }
    this.rectanglePlugin.rectangle.on('pointerdown', (e) => {
      // console.log('Selected!', this.character.name)
      if (e.downElement.tagName.toLowerCase() !== 'canvas') return
      blurAll()
      e.downElement.focus()
      app.target = this.model
      app.updates.next('target:stats')
    })
    // console.log('created!')
  }
  preUpdate() {
    if (!this.rectanglePlugin.rectangle) this.create()
    this.rectanglePlugin.update()
    this.namePlugin.update()
    this.shadowPlugin.update()
    this.handleJump()
  }
}
