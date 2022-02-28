// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { BattlePlayer } from './BattlePlayer'
import { BattleNpc } from './BattleNpc'

export class Battle extends Schema {
    @type("string") public battleId!: string;
    @type("string") public terrain!: string;
    @type({ map: BattlePlayer }) public players: MapSchema<BattlePlayer> = new MapSchema<BattlePlayer>();
    @type({ map: BattleNpc }) public npcs: MapSchema<BattleNpc> = new MapSchema<BattleNpc>();
}
