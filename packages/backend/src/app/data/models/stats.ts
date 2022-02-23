import { Model } from 'sequelize-typescript'

export class StatsModel extends Model {
  level: number
  currentExp: number
  maxExpForCurrentLevel: number
  baseStr: number
  baseDex: number
  baseVit: number
  baseAgi: number
  baseInt: number
  baseMnd: number
  baseChr: number
  strPerLevel: number
  dexPerLevel: number
  vitPerLevel: number
  agiPerLevel: number
  intPerLevel: number
  mndPerLevel: number
  chrPerLevel: number

  str: number
  dex: number
  vit: number
  agi: number
  int: number
  mnd: number
  chr: number
}
