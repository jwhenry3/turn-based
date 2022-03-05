import { from, lastValueFrom, tap } from 'rxjs'
import {
  Battle,
  BattleNpc,
  BattlePet,
  BattlePlayer,
} from '../../schemas/battles'
import { BattleHandler } from './battle.handler'

export class NpcLogic {
  constructor(public handler: BattleHandler, public npc: BattleNpc) {}

  async performAction() {
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
    this.handler.room.broadcast('battle:action', {
      battleId: this.handler.battle.battleId,
      entity: {
        battleNpcId: this.npc.battleNpcId,
      },
      target: {
        characterId: target.characterId,
        petId: target instanceof BattlePet ? target.petId : undefined,
      },
      duration: 60,
      abilityId: 'test',
    })
  }
}
