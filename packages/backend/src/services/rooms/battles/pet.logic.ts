import { BattleNpc, BattlePet, BattlePlayer } from '../../schemas/battles'
import { abilities } from './abilities'
import { BattleHandler } from './battle.handler'
import { getTargetFromAction } from './logic'

export class PetLogic {
  constructor(public handler: BattleHandler, public entity: BattlePet) {}

  async performAction(
    action: any,
    onVanquish: (target: BattlePet | BattlePlayer | BattleNpc) => void
  ) {
    const ability = abilities[action.abilityId]
    if (ability) {
      const target = getTargetFromAction(this.handler, action)
      if (target) {
        const results = ability(this.entity.stats, target.stats, () =>
          onVanquish(target)
        )
        if (results) {
          console.log('Pet Battle Action', action.abilityId, results)
          this.handler.room.broadcast('battle:action', {
            battleId: this.handler.battle.battleId,
            entity: {
              characterId: this.entity.characterId,
              petId: this.entity.petId,
            },
            target: action.target,
            abilityId: action.abilityId,
            results,
          })
          return true
        }
      }
    }
    return true
  }
}
