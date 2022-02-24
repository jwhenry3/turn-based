import styled from '@emotion/styled'
import { useRef } from 'react'
import { useEntityState } from '../../networking/state/use-entity-state'
import { useMovement } from './use-movement'
import { useUpdateLoop } from './use-update-loop'

export const PlayerEntity = styled.div`
  border: 1px solid #aaa;
  width: 32px;
  height: 64px;
  transform: translate3d(-16px, -56px, 0);
`
export const PlayerName = styled.div`
  position: relative;
  margin-top: -24px;
  height: 24px;
  background: #8af;
  text-align: center;
`
export const PlayerBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: green;
`
export function Player({ name }) {
  const position = useEntityState((state) => {
    return {
      x: state.entities[name]?.position.x || -1,
      y: state.entities[name]?.position.y || -1,
    }
  })
  const { positionsRef, move } = useMovement({ x: -1, y: -1 }, position)
  const element = useRef<HTMLElement | null>(null)

  useUpdateLoop(() => {
    move()
    if (element.current) {
      element.current.style.position = 'absolute'
      element.current.style.left = positionsRef.current.current.x + 'px'
      element.current.style.top = positionsRef.current.current.y + 'px'
    }
  })

  return (
    <PlayerEntity
      ref={(node) => {
        element.current = node
      }}
    >
      <PlayerName>{name}</PlayerName>
      <PlayerBody />
    </PlayerEntity>
  )
}
