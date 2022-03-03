// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { BattlePet } from './BattlePet'
import { Statistics } from './Statistics'

export class BattlePlayer extends Schema {
    @type("string") public characterId!: string;
    @type("number") public health!: number;
    @type("number") public mana!: number;
    @type("number") public cooldown!: number;
    @type(BattlePet) public pet: BattlePet = new BattlePet();
    @type(Statistics) public stats: Statistics = new Statistics();
    @type([ "string" ]) public status: ArraySchema<string> = new ArraySchema<string>();
    @type("number") public battleLocation!: number;
}
