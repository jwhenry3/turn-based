// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Character } from './Character'
import { AccountToken } from './AccountToken'

export class Account extends Schema {
    @type("string") public accountId!: string;
    @type("string") public username!: string;
    @type("string") public currentClientId!: string;
    @type(Character) public character: Character = new Character();
    @type(AccountToken) public token: AccountToken = new AccountToken();
    @type([ Character ]) public characterList: ArraySchema<Character> = new ArraySchema<Character>();
}
