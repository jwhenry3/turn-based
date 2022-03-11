import { Statistics } from '../../schemas/battles'

export function wasHit(modifier: number) {
  return Math.round(modifier * Math.random() * 2) >= 1
}
export function calculateDamage(base: number, modifier: number) {
  return Math.round(base + modifier * (1 + Math.random() * 2))
}
export function calculateMagicDamage(origin: Statistics, target: Statistics) {
  return calculateDamage(
    origin.baseDamage,
    Math.round(origin.intelligence.total / target.mind.total)
  )
}
export function calculateMagicAccuracy(origin: Statistics, target: Statistics) {
  return Math.round((origin.intelligence.total * 1.5) / target.mind.total)
}
export function calculateMeleeAccuracy(origin: Statistics, target: Statistics) {
  return Math.round(origin.dexterity.total / target.agility.total)
}
export function calculateRangedAccuracy(
  origin: Statistics,
  target: Statistics
) {
  return Math.round(
    ((origin.dexterity.total + target.agility.total / 2) /
      target.agility.total) *
      1.5
  )
}
export function calculateMeleeDamage(origin: Statistics, target: Statistics) {
  return calculateDamage(
    origin.baseDamage,
    Math.round(
      (target.strength.total + origin.dexterity.total / 2) /
        (target.vitality.total * 1.5)
    )
  )
}
export function calculateRangedDamage(origin: Statistics, target: Statistics) {
  return calculateDamage(
    origin.baseDamage,
    Math.round(
      (target.agility.total + origin.dexterity.total / 2) /
        (target.vitality.total + target.agility.total / 2)
    )
  )
}

export const abilities = {
  melee: (
    origin: Statistics,
    target: Statistics,
    onHealthDepleted: () => void
  ) => {
    if (wasHit(calculateMeleeAccuracy(origin, target))) {
      const damage = calculateMeleeDamage(origin, target)
      target.hp.total -= damage
      if (target.hp.total <= 0) {
        target.hp.total = 0
        onHealthDepleted()
      }
      return {
        type: 'hit',
        damage,
      }
    } else {
      return {
        type: 'miss',
      }
    }
  },
  attack: (
    origin: Statistics,
    target: Statistics,
    onHealthDepleted: () => void
  ) => abilities.melee(origin, target, onHealthDepleted),
  ranged: (
    origin: Statistics,
    target: Statistics,
    onHealthDepleted: () => void
  ) => {
    if (wasHit(calculateRangedAccuracy(origin, target))) {
      const damage = calculateRangedDamage(origin, target)
      target.hp.total -= damage
      if (target.hp.total <= 0) {
        target.hp.total = 0
        onHealthDepleted()
      }
      return {
        type: 'hit',
        damage,
      }
    } else {
      return {
        type: 'miss',
      }
    }
  },
  magic: (
    origin: Statistics,
    target: Statistics,
    onHealthDepleted: () => void
  ) => {
    if (wasHit(calculateMagicAccuracy(origin, target))) {
      const damage = calculateMagicDamage(origin, target)
      target.hp.total -= damage
      if (target.hp.total <= 0) {
        target.hp.total = 0
        onHealthDepleted()
      }
      return {
        type: 'hit',
        damage,
      }
    } else {
      return {
        type: 'miss',
      }
    }
  },
  heal: (origin: Statistics, target: Statistics) => {
    return {
      healing: 1,
    }
  },
}
