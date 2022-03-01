// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Attribute extends Schema {
    @type("number") public baseAmount!: number;
    @type("number") public fromPoints!: number;
    @type("number") public fromEquipment!: number;
    @type("number") public fromBuffs!: number;
    @type("number") public total!: number;
}
