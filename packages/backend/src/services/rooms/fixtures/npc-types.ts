import { NpcType } from '../fixture.models'

export const npcTypes: Record<string, NpcType> = {
  npc: new NpcType({
    npcTypeId: 'npc',
    name: 'NPC',
    canWander: true,
    wanderRadius: 64,
  }),
}
