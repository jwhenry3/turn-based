import { BattlePlayer } from '../../schemas/battles'
import { BattleHandler } from './battle.handler'

export class PlayerLogic {
  constructor(public handler: BattleHandler, public entity: BattlePlayer) {}

  async performAction(action: any) {
    // console.log('Player performed an action')
    // console.log(action)
    this.handler.room.broadcast('battle:action', {
      battleId: this.handler.battle.battleId,
      entity: {
        characterId: this.entity.characterId
      },
      target: action.target,
      duration: 60,
      abilityId: action.abilityId,
    })
    return true
  }
}
