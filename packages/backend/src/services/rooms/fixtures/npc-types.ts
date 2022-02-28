import { BattleNpc, BattleNpcType } from '../../schemas/battles'
import { NpcType } from '../fixture.models'

export const npcTypes: Record<string, NpcType> = {
  npc: new NpcType({
    npcTypeId: 'npc',
    name: 'NPC',
    canWander: true,
    wanderRadius: 128,
    isAggressive: false,
    triggersBattle: true,
    battleNpcs: [
      new BattleNpc({
        name: 'Test Battle Npc',
      }),
    ],
  }),
}
