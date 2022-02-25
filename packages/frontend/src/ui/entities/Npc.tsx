import styled from '@emotion/styled'
import { useRef } from 'react'
import { useEntityState } from '../../networking/state/use-entity-state'
import { useMovement } from './use-movement'
import { useUpdateLoop } from './use-update-loop'

export const NpcEntity = styled.div`
  width: 32px;
  height: 64px;
  transform: translate3d(-16px, -56px, 0);
  display: flex;
  flex-direction: column;
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`
export const NpcName = styled.div`
  position: absolute;
  bottom: 72px;
  font-size: 12px;
  font-weight: 600;
  font-style: italic;
  color: #fff;
  text-shadow: 0 -1px #000, -1px 0 #000, 0 1px #000, 1px 0 #000, -1px -1px #000,
    1px -1px #000, -1px 1px #000, 1px 1px #000;
  background: #ffcf88;
  text-align: center;
  white-space: nowrap;
  border-radius: 12px;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
  font-family: Arial, Helvetica, sans-serif;
  padding: 0 8px;
  > div {
    margin-top: -8px;
  }
`
export const NpcBody = styled.div`
  position: relative;
  background: orange;
  flex: 1;
  width: 100%;
  border-radius: 24px;
`
export function Npc({ id }) {
  const { name, x, y } = useEntityState((state) => {
    return {
      name: state.entities.npcs[id]?.name,
      x: state.entities.npcs[id]?.position.x || -1,
      y: state.entities.npcs[id]?.position.y || -1,
    }
  })
  const { positionsRef, move } = useMovement({ x: -1, y: -1 }, { x, y })
  const element = useRef<HTMLElement | null>(null)

  useUpdateLoop(() => {
    move()
    if (element.current) {
      element.current.style.position = 'absolute'
      element.current.style.left = positionsRef.current.current.x + 'px'
      element.current.style.top = positionsRef.current.current.y + 'px'
      element.current.style.zIndex = positionsRef.current.current.y + ''
    }
  })
  return <></>
  // return (
  //   <NpcEntity
  //     ref={(node) => {
  //       element.current = node
  //     }}
  //   >
  //     <div style={{ position: 'relative' }}>
  //       <NpcName>
  //         <div>{name}</div>
  //       </NpcName>
  //       <NpcBody />
  //     </div>
  //   </NpcEntity>
  // )
}
