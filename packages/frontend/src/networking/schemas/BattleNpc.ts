// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Statistics } from './Statistics'
import { BattleNpcType } from './BattleNpcType'

export class BattleNpc extends BattleNpcType {
    @type("string") public battleNpcId!: string;
    @type("string") public battleNpcTypeId!: string;
    @type("string") public name!: string;
    @type("number") public battleLocation!: number;
    @type("string") public element!: string;
    @type("number") public level!: number;
    @type("number") public expYield!: number;
    @type(Statistics) public stats: Statistics = new Statistics();
}
