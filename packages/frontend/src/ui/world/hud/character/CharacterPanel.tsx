import styled from '@emotion/styled'
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
`
export const ValuesWrapper = styled.div`
  margin-top: -12px;
  border-radius: 8px;
  padding: 8px;
  padding-top: 8px;
  background-color: rgba(0, 0, 0, 0.75);
`
export const ValuesContainer = styled.div`
  /* transform: skew(-8deg, -8deg) rotate(8deg); */
  border-radius: 4px;
  overflow: hidden;
  z-index: 2;
`
export function CharacterPanel() {
  return (
    <CharacterContainer>
      <Name />
      <ValuesWrapper>
        <ValuesContainer>
          <Health />
          <Mana />
        </ValuesContainer>
      </ValuesWrapper>
    </CharacterContainer>
  )
}
