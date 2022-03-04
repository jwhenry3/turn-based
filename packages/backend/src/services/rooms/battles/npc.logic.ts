import { Battle, BattleNpc } from '../../schemas/battles'
import { BattleHandler } from './battle.handler'

export class NpcLogic {
  constructor(public handler: BattleHandler, public npc: BattleNpc) {}

  performAction() {
    console.log('NPC should perform an action')
    this.handler.room.broadcast('battle:action', {
      battleId: this.handler.battle.battleId,
      entity: this.npc.battleNpcId,
      target: this.handler.battle.players.values()[0],
      duration: 60,
      abilityId: 'test',
    })
    this.npc.cooldown = this.npc.speed * 16
  }
}
