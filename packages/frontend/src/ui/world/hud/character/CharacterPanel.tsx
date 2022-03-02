import styled from '@emotion/styled'
import { WindowPanel } from '../WindowPanel'
import { Health } from './Health'
import { Mana } from './Mana'
import { Name } from './Name'
export const CharacterContainer = styled.div`
  position: fixed;
  top: 48px;
  left: 8px;
  /* background-color: rgba(0, 0, 0, 0.75); */
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 240px;
  border-radius: 8px;
  width: 25vw;
  @media(max-width: 420px) {
    min-width: 50vw;
    padding-right:16px;
  }
`
export const ValuesWrapper = styled.div`
  padding: 8px;
`
export const ValuesContainer = styled.div`
  overflow: hidden;
  z-index: 2;
`
export function CharacterPanel() {
  return (
    <CharacterContainer>
      <Name />
      <WindowPanel style={{ marginTop: '-12px' }}>
        <ValuesWrapper>
          <ValuesContainer>
            <Health />
            <Mana />
          </ValuesContainer>
        </ValuesWrapper>
      </WindowPanel>
    </CharacterContainer>
  )
}
