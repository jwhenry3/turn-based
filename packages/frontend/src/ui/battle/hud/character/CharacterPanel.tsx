import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { filter } from 'rxjs'
import { app } from '../../../app'
import { WindowPanel } from '../../../world/hud/WindowPanel'
import { Health } from '../bars/Health'
import { Mana } from '../bars/Mana'
import { Name } from '../details/Name'
export const CharacterContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 240px;
  /* background-color: rgba(0, 0, 0, 0.75); */
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 8px;
`
export const ValuesWrapper = styled.div`
  padding: 8px;
`
export const ValuesContainer = styled.div`
  overflow: hidden;
  z-index: 2;
`
export function CharacterPanel() {
  const [character, setCharacter] = useState(app.character || undefined)
  useEffect(() => {
    setCharacter(app.character)
    const sub = app.updates
      .pipe(filter((value) => value === 'character:stats'))
      .subscribe(() => {
        setCharacter(app.character)
      })
    return () => sub.unsubscribe()
  }, [])
  if (!character) return <></>
  return (
    <CharacterContainer>
      <Name name={character.name} />
      <WindowPanel style={{ marginTop: '-12px' }}>
        <ValuesWrapper>
          <ValuesContainer>
            <Health stats={character.stats} />
            <Mana stats={character.stats} />
          </ValuesContainer>
        </ValuesWrapper>
      </WindowPanel>
    </CharacterContainer>
  )
}
