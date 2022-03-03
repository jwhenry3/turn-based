import styled from '@emotion/styled'
import { app } from '../../../app'
import { GameText } from '../../text/Text'
export const ManaContainer = styled.div`
  position: relative;
  padding: 2px 4px;
  font-size: 12px;
  overflow: hidden;
  z-index: 2;
  > * {
    font-size: 12px;
    font-style: italic;
  }
`
export const ManaAmount = styled.div`
  background: rgb(45, 136, 253);
  background: linear-gradient(0deg, #435d96 0%, rgba(45, 136, 253, 1) 100%);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: -1;
`
export function Mana() {
  return (
    <ManaContainer>
      <ManaAmount />
      <GameText>
        {app.character.stats.mp.total} / {app.character.stats.maxMp.total}
      </GameText>
    </ManaContainer>
  )
}
