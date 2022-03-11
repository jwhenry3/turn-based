import { BattleNpc, BattlePet, BattlePlayer } from '../../schemas/battles'
import { abilities } from './abilities'
import { BattleHandler } from './battle.handler'
import { getTargetFromAction } from './logic'

export class PlayerLogic {
  constructor(public handler: BattleHandler, public entity: BattlePlayer) {}

  async performAction(
    action: any,
    onVanquish: (entity: BattleNpc | BattlePlayer | BattlePet) => void
  ) {

    const ability = abilities[action.abilityId]
    if (ability) {
      const target = getTargetFromAction(this.handler, action)
      if (target) {
        const results = ability(this.entity.stats, target.stats, () =>
          onVanquish(target)
        )
        if (results) {
          console.log('Player Battle Action', action.abilityId, results)
          this.handler.room.broadcast('battle:action', {
            battleId: this.handler.battle.battleId,
            entity: {
              characterId: this.entity.characterId,
            },
            target: action.target,
            duration: 60,
            abilityId: action.abilityId,
            results,
          })
          return true
        }
      }
    }
    return false
  }
}
