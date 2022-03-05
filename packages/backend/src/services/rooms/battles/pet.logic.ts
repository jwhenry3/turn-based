import { BattlePet } from '../../schemas/battles'
import { BattleHandler } from './battle.handler'

export class PetLogic {
  constructor(public handler: BattleHandler, public entity: BattlePet) {}

  performAction(action: any) {
    console.log('Player performed an action with pet')
  }
}
