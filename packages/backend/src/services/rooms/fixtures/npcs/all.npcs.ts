import { BattleNpc } from '../../../schemas/battles'
import { NpcData } from '../../fixture.models'
import { npcTypes } from './npc-types'

export const allNpcs = {
  1: new NpcData({
    npcId: '1',
    ...npcTypes.npc,
    name: 'Bob',
  }),
  2: new NpcData({
    npcId: '2',
    ...npcTypes.npc,
    name: 'James',
  }),
  3: new NpcData({
    npcId: '3',
    ...npcTypes.npc,
    name: 'Dean',
  }),
  4: new NpcData({
    npcId: '4',
    ...npcTypes.npc,
    name: 'Roger',
  }),
  5: new NpcData({
    npcId: '5',
    ...npcTypes.npc,
    name: 'Sarah',
    isAggressive: true,
    chaseRadius: 128,
    triggersBattle: true,
    randomizeBattleNpcs: true,
    maxEnemies: 4,
    battleNpcs: [
      new BattleNpc({
        name: 'Test Battle Npc',
      }),
    ],
  }),
  6: new NpcData({
    npcId: '6',
    ...npcTypes.npc,
    name: 'Patricia',
    triggersBattle: true,
    battleNpcs: [
      new BattleNpc({
        name: 'Test Battle Npc',
        battleLocation: 2,
      }),
      new BattleNpc({
        name: 'Test Battle Npc',
        battleLocation: 7,
      }),
      new BattleNpc({
        name: 'Test Battle Npc',
        battleLocation: 9,
      }),
    ],
  }),
}
