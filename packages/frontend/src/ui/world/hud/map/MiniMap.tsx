import styled from '@emotion/styled'
import { MapMenu } from './MapMenu'
const MiniMapContainer = styled.div`
  position: fixed;
  top: 56px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.75);
  padding: 8px;
  color: #fff;
  width: 15vw;
  height: 15vw;
  border-radius: 8px;
  display: flex;
  align-items: stretch;
  text-align: center;
  min-width: 160px;
  min-height: 160px;
  > * {
    position: relative;
    flex: 1;
  }
`
export function MiniMap() {
  return (
    <MiniMapContainer>
      <div>
        <MapMenu />
      </div>
    </MiniMapContainer>
  )
}
