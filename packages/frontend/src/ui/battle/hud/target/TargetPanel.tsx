import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { filter, pipe } from 'rxjs'
import { app } from '../../../app'
import { WindowPanel } from '../../../world/hud/WindowPanel'
import { Health } from '../bars/Health'
import { Mana } from '../bars/Mana'
import { Name } from '../details/Name'
export const CharacterContainer = styled.div`
  position: fixed;
  bottom: top;
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
export function TargetPanel() {
  const [target, setTarget] = useState(app.target || undefined)
  useEffect(() => {
    setTarget(app.target)
    const sub = app.updates
      .pipe(filter((value) => value === 'target:stats'))
      .subscribe(() => {
        setTarget(app.target)
      })
    return () => sub.unsubscribe()
  }, [])
  if (!target?.stats) return <></>
  return (
    <CharacterContainer>
      <Name name={target.name} />
      <WindowPanel style={{ marginTop: '-12px' }}>
        <ValuesWrapper>
          <ValuesContainer>
            <Health stats={target.stats} />
            <Mana stats={target.stats} />
          </ValuesContainer>
        </ValuesWrapper>
      </WindowPanel>
    </CharacterContainer>
  )
}
