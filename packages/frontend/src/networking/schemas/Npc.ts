// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { ItemDrop } from './ItemDrop'
import { Statistics } from './Statistics'
import { Position } from './Position'

export class Npc extends Schema {
    @type("string") public npcId!: string;
    @type("string") public npcTypeId!: string;
    @type("string") public name!: string;
    @type([ ItemDrop ]) public drops: ArraySchema<ItemDrop> = new ArraySchema<ItemDrop>();
    @type(Statistics) public stats: Statistics = new Statistics();
    @type(Position) public position: Position = new Position();
}
