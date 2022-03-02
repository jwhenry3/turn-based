import styled from '@emotion/styled'
import { WindowPanel } from '../WindowPanel'
import { useMapToggleState } from './use-map-toggle-state'
const MiniMapContainer = styled.div`
  position: fixed;
  top: 8px;
  right: 8px;
  padding: 8px;
  width: 15vw;
  height: 15vw;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: center;
  min-width: 160px;
  min-height: 180px;

  > * {
    position: relative;
  }
  @media (max-width: 420px) {
    min-width: 50vw;
    padding-left: 16px;
  }
`
export function MiniMap() {
  const { opened } = useMapToggleState()
  return (
    <MiniMapContainer
      style={{ display: opened ? 'flex' : 'none', width: '100%' }}
    >
      <WindowPanel />
    </MiniMapContainer>
  )
}
