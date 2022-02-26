// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Effect } from './Effect'

export class Status extends Schema {
    @type("number") public hp!: number;
    @type("number") public mp!: number;
    @type([ Effect ]) public effects: ArraySchema<Effect> = new ArraySchema<Effect>();
}
