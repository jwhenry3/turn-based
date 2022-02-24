import { useRef, useState } from 'react'

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}
export function useMovement(
  startingPosition: { x: number; y: number },
  nextPosition: { x: number; y: number }
) {
  const positionsRef = useRef({
    current: startingPosition,
    new: startingPosition,
  })
  positionsRef.current.new = nextPosition
  return {
    positionsRef,
    move: () => {
      const positions = positionsRef.current
      // console.log(positions)
      // if (positions.new) {
      if (
        positions.current.x !== positions.new.x ||
        positions.current.y !== positions.new.y
      ) {
        if (positions.current.x === -1 && positions.current.y === -1) {
          positions.current = { x: positions.new.x, y: positions.new.y }
          return
        }
        if (
          Math.abs(positions.new.x - positions.current.x) >= 1 ||
          Math.abs(positions.new.y - positions.current.y) >= 1
        ) {
          positions.current = {
            x: Math.round(lerp(positions.current.x, positions.new.x, 0.1)),
            y: Math.round(lerp(positions.current.y, positions.new.y, 0.1)),
          }

          return
        }
      }
    },
  }
}
