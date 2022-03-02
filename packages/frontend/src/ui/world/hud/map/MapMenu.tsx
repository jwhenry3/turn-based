import styled from '@emotion/styled'

export const MapMenuContainer = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  bottom: -12px;
  left: -12px;
`
export function MapMenu() {
  return <MapMenuContainer></MapMenuContainer>
}
