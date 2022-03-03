import styled from '@emotion/styled'
import { useEffect } from 'react'
import { app } from '../../../app'
import { GameText } from '../../text/Text'
export const HealthContainer = styled.div`
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
export const HealthAmount = styled.div`
  background: rgb(34, 193, 195);
  background: linear-gradient(0deg, #718b8b 0%, #17c058 100%);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: -1;
`
export function Health() {
  return (
    <HealthContainer>
      <HealthAmount />
      <GameText>
        {app.character.stats.hp.total} / {app.character.stats.maxHp.total}
      </GameText>
    </HealthContainer>
  )
}
