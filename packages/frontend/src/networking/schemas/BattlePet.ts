// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class BattlePet extends Schema {
    @type("string") public characterId!: string;
    @type("number") public health!: number;
    @type("number") public mana!: number;
    @type("number") public cooldown!: number;
}
