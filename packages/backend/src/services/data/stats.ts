import { Column, Model } from 'sequelize-typescript'

export class StatsModel extends Model {
  @Column
  characterId: string

  @Column
  level: number
  @Column
  currentExp: number
  @Column
  availablePoints: number
  @Column
  baseStr: number
  @Column
  baseDex: number
  @Column
  baseVit: number
  @Column
  baseAgi: number
  @Column
  baseInt: number
  @Column
  baseMnd: number
  @Column
  baseChr: number
  @Column
  appliedStr: number
  @Column
  appliedDex: number
  @Column
  appliedVit: number
  @Column
  appliedAgi: number
  @Column
  appliedInt: number
  @Column
  appliedMnd: number
  @Column
  appliedChr: number
}
