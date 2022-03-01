// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Character } from './Character'
import { Npc } from './Npc'
import { Battle } from './Battle'

export class MmorpgMapState extends Schema {
    @type({ map: Character }) public players: MapSchema<Character> = new MapSchema<Character>();
    @type({ map: Character }) public playersByClient: MapSchema<Character> = new MapSchema<Character>();
    @type({ map: Npc }) public npcs: MapSchema<Npc> = new MapSchema<Npc>();
    @type({ map: Battle }) public battles: MapSchema<Battle> = new MapSchema<Battle>();
}
