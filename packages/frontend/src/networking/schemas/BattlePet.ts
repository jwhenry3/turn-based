// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Statistics } from './Statistics'

export class BattlePet extends Schema {
    @type("string") public characterId!: string;
    @type("string") public petId!: string;
    @type("string") public npcTypeId!: string;
    @type("number") public health!: number;
    @type("number") public mana!: number;
    @type("number") public cooldown!: number;
    @type("boolean") public canAct!: boolean;
    @type(Statistics) public stats: Statistics = new Statistics();
}
