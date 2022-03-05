import { BattlePlayer } from '../../schemas/battles'
import { BattleHandler } from './battle.handler'

export class PlayerLogic {
  constructor(public handler: BattleHandler, public entity: BattlePlayer) {}

  performAction(action: any) {
    console.log('Player performed an action')
  }
}
