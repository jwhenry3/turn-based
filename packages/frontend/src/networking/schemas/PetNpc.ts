// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Statistics } from './Statistics'
import { Npc } from './Npc'

export class PetNpc extends Npc {
    @type("string") public characterId!: string;
    @type(Statistics) public stats: Statistics = new Statistics();
}
