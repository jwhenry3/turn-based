import styled from '@emotion/styled'
import { WindowPanel } from '../WindowPanel'
import { MapMenu } from './MapMenu'
const MiniMapContainer = styled.div`
  position: fixed;
  top: 56px;
  right: 8px;
  padding: 8px;
  width: 15vw;
  height: 15vw;
  display: flex;
  align-items: stretch;
  text-align: center;
  min-width: 160px;
  min-height: 160px;
  > * {
    position: relative;
    flex: 1;
  }
  @media(max-width: 420px) {
    min-width: 50vw;
    padding-left:16px;
  }
`
export function MiniMap() {
  return (
    <MiniMapContainer>
      <WindowPanel>
        <div>
          <MapMenu />
        </div>
      </WindowPanel>
    </MiniMapContainer>
  )
}
