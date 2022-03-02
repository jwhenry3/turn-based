import { BattleNpc } from '../../schemas/battles'
import { NpcData } from '../fixture.models'
import { npcTypes } from './npcs/npc-types'

export const starterNpcs: NpcData[] = [
  new NpcData({
    npcId: '1',
    ...npcTypes.npc,
    name: 'Bob',
    x: 100,
    y: 100,
  }),
  new NpcData({
    npcId: '2',
    ...npcTypes.npc,
    name: 'James',
    x: 40,
    y: 160,
  }),
  new NpcData({
    npcId: '3',
    ...npcTypes.npc,
    name: 'Dean',
    x: 320,
    y: 400,
  }),
  new NpcData({
    npcId: '4',
    ...npcTypes.npc,
    name: 'Roger',
    x: 200,
    y: 600,
  }),
  new NpcData({
    npcId: '5',
    ...npcTypes.npc,
    name: 'Sarah',
    isAggressive: true,
    chaseRadius: 128,
    x: 700,
    y: 200,
    triggersBattle: true,
    battleNpcs: [
      new BattleNpc({
        name: 'Test Battle Npc',
      }),
    ],
  }),
  new NpcData({
    npcId: '6',
    ...npcTypes.npc,
    name: 'Patricia',
    x: 500,
    y: 500,
  }),
]
