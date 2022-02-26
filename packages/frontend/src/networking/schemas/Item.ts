// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { ItemCategory } from './ItemCategory'

export class Item extends Schema {
    @type("string") public itemId!: string;
    @type(ItemCategory) public category: ItemCategory = new ItemCategory();
}
