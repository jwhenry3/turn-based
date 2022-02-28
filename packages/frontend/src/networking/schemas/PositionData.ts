// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Movement } from './Movement'

export class PositionData extends Schema {
    @type("string") public map!: string;
    @type("number") public x!: number;
    @type("number") public y!: number;
    @type("number") public speed!: number;
    @type(Movement) public movement: Movement = new Movement();
}
