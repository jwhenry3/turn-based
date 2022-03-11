import { from, lastValueFrom, tap } from 'rxjs'
import {
  Battle,
  BattleNpc,
  BattlePet,
  BattlePlayer,
} from '../../schemas/battles'
import { abilities } from './abilities'
import { BattleHandler } from './battle.handler'

export class NpcLogic {
  constructor(public handler: BattleHandler, public entity: BattleNpc) {}

  async performAction(
    onVanquish: (target: BattlePlayer | BattlePet | BattleNpc) => void
  ) {
    // console.log('NPC should perform an action')
    const players = this.handler.battle.players
    const options: (BattlePet | BattlePlayer)[] = []
    await lastValueFrom(
      from(players.values()).pipe(
        tap((player) => {
          options.push(player)
          if (player.pet) {
            options.push(player.pet)
          }
        })
      )
    )
    const attackOption = Math.round(Math.random() * (options.length - 1))
    const target = options[attackOption]
    const chosenAttackMethod = Math.round(Math.random() * 3)
    const methods = ['melee', 'ranged', 'magic']
    const ability = abilities[methods[chosenAttackMethod]]
    if (ability) {
      if (target) {
        const results = ability(this.entity.stats, target.stats, () =>
          onVanquish(target)
        )
        if (results) {
          console.log('Npc Battle Action', 'attack', results)
          this.handler.room.broadcast('battle:action', {
            battleId: this.handler.battle.battleId,
            entity: {
              battleNpcId: this.entity.battleNpcId,
            },
            target: {
              characterId: target.characterId,
              petId: (target as BattlePet).petId,
            },
            abilityId: methods[chosenAttackMethod],
            duration: 60,
            results,
          })
          return true
        }
      }
    }
  }
}
