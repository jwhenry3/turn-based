// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Attribute } from './Attribute'

export class Effect extends Schema {
    @type("string") public effectId!: string;
    @type(Attribute) public potency: Attribute = new Attribute();
    @type("number") public remainingDuration!: number;
}
