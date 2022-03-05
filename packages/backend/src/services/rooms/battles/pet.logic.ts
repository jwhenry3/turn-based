import { BattlePet } from '../../schemas/battles'
import { BattleHandler } from './battle.handler'

export class PetLogic {
  constructor(public handler: BattleHandler, public entity: BattlePet) {}

  async performAction(action: any) {
    // console.log('Player performed an action with pet')
    this.handler.room.broadcast('battle:action', {
      battleId: this.handler.battle.battleId,
      entity: {
        characterId: this.entity.characterId,
        petId: this.entity.petId,
      },
      target: action.target,
      duration: 60,
      abilityId: action.abilityId,
    })
    return true
  }
}
