// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class InventoryItem extends Schema {
    @type("string") public inventoryItemId!: string;
    @type("string") public itemId!: string;
    @type("number") public quantity!: number;
    @type("number") public inventoryPositionId!: number;
}
