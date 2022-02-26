// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Attribute } from './Attribute'

export class Statistics extends Schema {
    @type("number") public level!: number;
    @type("number") public grantExpOnDeath!: number;
    @type("number") public currentExp!: number;
    @type("number") public maxExpForCurrentLevel!: number;
    @type("number") public availableStatPoints!: number;
    @type(Attribute) public maxHp: Attribute = new Attribute();
    @type(Attribute) public maxMp: Attribute = new Attribute();
    @type(Attribute) public str: Attribute = new Attribute();
    @type(Attribute) public dex: Attribute = new Attribute();
    @type(Attribute) public vit: Attribute = new Attribute();
    @type(Attribute) public agi: Attribute = new Attribute();
    @type(Attribute) public int: Attribute = new Attribute();
    @type(Attribute) public mnd: Attribute = new Attribute();
    @type(Attribute) public chr: Attribute = new Attribute();
}
