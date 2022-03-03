import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { app } from '../../../app'
import { GameText } from '../../text/Text'
export const NameContainer = styled.div`
  position: relative;
  border-radius: 4px;
  padding: 2px 8px;
  > * {
    font-size: 12px;
  }
`
export function Name() {
  return (
    <NameContainer>
      <GameText style={{ fontStyle: 'italic' }}>{app.character.name}</GameText>
    </NameContainer>
  )
}
