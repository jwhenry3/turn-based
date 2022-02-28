// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Appearance } from './Appearance'
import { Statistics } from './Statistics'
import { PositionData } from './PositionData'
import { Inventory } from './Inventory'

export class Character extends Schema {
    @type("string") public accountId!: string;
    @type("string") public characterId!: string;
    @type("string") public currentClientId!: string;
    @type("string") public name!: string;
    @type("boolean") public isInBattle!: boolean;
    @type("string") public status!: string;
    @type("boolean") public inBattle!: boolean;
    @type(Appearance) public appearance: Appearance = new Appearance();
    @type(Statistics) public stats: Statistics = new Statistics();
    @type(PositionData) public position: PositionData = new PositionData();
    @type(Inventory) public inventory: Inventory = new Inventory();
}
