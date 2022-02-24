import { Column, ForeignKey, Model, Table, Unique } from 'sequelize-typescript'
import { CharacterModel } from './character'

@Table
export class StatsModel extends Model {
  @ForeignKey(() => CharacterModel)
  @Unique
  @Column
  characterId: string

  @Column
  level: number = 1
  @Column
  currentExp: number = 0
  @Column
  availablePoints: number = 10
  @Column
  baseStr: number = 5
  @Column
  baseDex: number = 5
  @Column
  baseVit: number = 5
  @Column
  baseAgi: number = 5
  @Column
  baseInt: number = 5
  @Column
  baseMnd: number = 5
  @Column
  baseChr: number = 5
  @Column
  appliedStr: number = 0
  @Column
  appliedDex: number = 0
  @Column
  appliedVit: number = 0
  @Column
  appliedAgi: number = 0
  @Column
  appliedInt: number = 0
  @Column
  appliedMnd: number = 0
  @Column
  appliedChr: number = 0
}
