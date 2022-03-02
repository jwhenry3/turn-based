import { NpcInput } from './npc-input'

export class NpcPlugin {
  get npc() {
    return this.input.npc
  }
  get data() {
    return this.input.data
  }
  get movementUpdates() {
    return this.input.movementUpdates
  }
  constructor(public input: NpcInput) {}
}
