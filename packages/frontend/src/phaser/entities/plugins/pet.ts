import { PetNpc } from '../../../networking/schemas/PetNpc'
import { NetworkedScene } from '../../scenes/networked.scene'
import { PetEntity } from '../pet'
import { PlayerEntity } from '../player'

export class PetPlugin {
  pet: PetEntity
  constructor(public scene: NetworkedScene, public owner: PlayerEntity) {}

  create() {
    if (this.owner.model.pet) {
      this.pet = new PetEntity(this.owner.model.pet, this.scene)
      this.pet.owner = this.owner
      this.scene.add.existing(this.pet)
    }
    this.owner.model.listen('pet', (pet?: PetNpc, previous?: PetNpc) => {
      if (pet && !previous) {
        // console.log('added pet 2')
        this.pet = new PetEntity(pet, this.scene)
        this.pet.owner = this.owner
        this.scene.add.existing(this.pet)
      } else if ((!pet && previous) || pet?.npcId !== previous?.npcId) {
        this.pet.destroy()
        this.pet = undefined
      }
    })
  }

  update() {
    if (this.owner.model.isInBattle) {
      if (this.pet?.visible === true) {
        this.pet.setVisible(false)
      }
    } else {
      if (this.pet?.visible === false) {
        this.pet.setVisible(true)
      }
    }
  }
}
