import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { filter } from 'rxjs'
import { app } from '../../../app'
import { WindowPanel } from '../../../world/hud/WindowPanel'
import { Health } from '../bars/Health'
import { Mana } from '../bars/Mana'
import { Name } from '../details/Name'
export const PetContainer = styled.div`
  position: fixed;
  top: 0;
  right: 8px;
  width: 50vw;
  padding-left: 16px;
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
export function PetPanel() {
  const [character, setCharacter] = useState(app.character?.pet || undefined)
  useEffect(() => {
    setCharacter(app.character?.pet)
    const sub = app.updates
      .pipe(filter((value) => value === 'character:stats'))
      .subscribe(() => {
        setCharacter(app.character?.pet)
      })
    return () => sub.unsubscribe()
  }, [])
  if (!character) return <></>
  return (
    <PetContainer>
      <Name name={character.name} />
      <WindowPanel style={{ marginTop: '-12px' }}>
        <ValuesWrapper>
          <ValuesContainer>
            <Health stats={character.stats} />
            <Mana stats={character.stats} />
          </ValuesContainer>
        </ValuesWrapper>
      </WindowPanel>
    </PetContainer>
  )
}
