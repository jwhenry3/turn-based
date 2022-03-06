import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { filter } from 'rxjs'
import { BattlePlayer } from '../../../../networking/schemas/BattlePlayer'
import { BattleScene } from '../../../../phaser/scenes/battle.scene'
import { app } from '../../../app'
import { WindowPanel } from '../../../world/hud/WindowPanel'
import { Health } from '../bars/Health'
import { Mana } from '../bars/Mana'
import { Name } from '../details/Name'
export const CharacterContainer = styled.div`
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
  const [character, setCharacter] = useState(undefined)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const battleScene = app.game.scene.getScene('battle') as BattleScene
    if (battleScene) {
      setCharacter(battleScene.localPlayer.model)
    }
    const sub = app.battleEvents
      .pipe(
        filter(({ event, entity }) => {
          console.log(event, entity)
          return (
            event === 'battle:update' &&
            (entity as BattlePlayer).characterId === app.character.characterId
          )
        })
      )
      .subscribe(({ entity }) => {
        console.log(entity, entity.stats.hp.total)
        if (!(entity as any).petId) {
          setCharacter(entity)
          setTick(tick + 1)
        }
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
