import { BattlePlayer, BattlePet, BattleNpc } from '../../schemas/battles'
import { BattleHandler } from './battle.handler'

export function getTargetFromAction(handler: BattleHandler, action: any) {
  if (action.target.battleNpcId) {
    return handler.battle.npcs[action.target.battleNpcId] as BattleNpc
  }
  if (action.target.petId && action.target.characterId) {
    return handler.battle.players[action.target.characterId].pet as BattlePet
  }
  if (!action.target.petId && action.target.characterId) {
    return handler.battle.players[action.target.characterId] as BattlePlayer
  }
}
