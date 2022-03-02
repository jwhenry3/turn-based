import { NpcData } from '../../rooms/fixture.models'
import { allNpcs } from '../../rooms/fixtures/npcs/all.npcs'
import { SpatialNode } from '../../rooms/spacial/node'
import { NpcInput } from '../../scripts/npc-input'
import { Character, Npc } from '../schemas'

export function createNpc(npcId:string, x:number, y:number) {
  const data = new NpcData({
    ...allNpcs[npcId],
    x,
    y,
  })
  const npc = new Npc({
    npcId: npcId,
    npcTypeId: data.npcTypeId,
    name: data.name,
  })
  npc.position.x = data.x
  npc.position.y = data.y
  npc.position.owner = npc
  npc.node = new SpatialNode(npc)
  return {npc, data}
}
