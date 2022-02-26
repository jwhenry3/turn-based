import { lerp } from './lerp'

export function move(
  nextPosition: { x: number; y: number },
  previousPosition: { x: number; y: number }
) {
  if (
    previousPosition.x !== nextPosition.x ||
    previousPosition.y !== nextPosition.y
  ) {
    if (previousPosition.x === -1 && previousPosition.y === -1) {
      previousPosition = { x: nextPosition.x, y: nextPosition.y }
      return
    }
    if (
      Math.abs(nextPosition.x - previousPosition.x) >= 1 ||
      Math.abs(nextPosition.y - previousPosition.y) >= 1
    ) {
      return {
        x: Math.round(lerp(previousPosition.x, nextPosition.x, 0.1)),
        y: Math.round(lerp(previousPosition.y, nextPosition.y, 0.1)),
      }
    }
  }
  return nextPosition
}
