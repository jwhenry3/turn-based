import styled from '@emotion/styled'
import { Fab } from '@mui/material'
import { useEffect, useState } from 'react'
import { BattleNpc } from '../../../../networking/schemas/BattleNpc'
import { BattlePet } from '../../../../networking/schemas/BattlePet'
import { BattlePlayer } from '../../../../networking/schemas/BattlePlayer'
import { BattleSceneEnemy } from '../../../../phaser/entities/battle/battle-enemy'
import { BattleScenePet } from '../../../../phaser/entities/battle/battle-pet'
import { BattleScenePlayer } from '../../../../phaser/entities/battle/battle-player'
import { BattleScene } from '../../../../phaser/scenes/battle.scene'
import { app } from '../../../app'

export const BattleActionsContainer = styled.div`
  position: fixed;
  bottom: 8px;
  left: 68px;
  right: 68px;
  margin: auto;
  max-width: 300px;
  min-width: 200px;
  > * {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding: 8px;
  }
`
export const LeaveBattleContainer = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
`
export const ActionMenuContainer = styled.div`
  position: fixed;
  left: 16px;
  bottom: 16px;
`

let __playerCanAct = false
let __petCanAct = false
let __hasTarget = false
export function BattleActions() {
  const [hasTarget, setHasTarget] = useState(false)
  const [playerCanAct, setPlayerCanAct] = useState(false)
  const [petCanAct, setPetCanAct] = useState(false)
  useEffect(() => {
    __playerCanAct = false
    __petCanAct = false
    __hasTarget = false
    const interval = setInterval(() => {
      const battleScene = app.game.scene.getScene('battle') as BattleScene
      if (battleScene) {
        const _petCanAct = !!battleScene.localPlayer?.pet?.model.canAct
        const _playerCanAct = !!battleScene.localPlayer?.model.canAct
        if (_petCanAct !== __petCanAct) {
          __petCanAct = _petCanAct
          setPetCanAct(_petCanAct)
        }
        if (_playerCanAct !== __playerCanAct) {
          __playerCanAct = _playerCanAct
          setPlayerCanAct(_playerCanAct)
        }
        if (!!app.target !== __hasTarget) {
          setHasTarget(!!app.target)
          __hasTarget = !!app.target
        }
      }
    }, 500)
    return () => clearInterval(interval)
  }, [setPlayerCanAct, setPetCanAct, setHasTarget])

  const getTargetData = () => {
    const isNpc = !!(app.target as BattleNpc).battleNpcId
    const isPlayer =
      !!(app.target as BattlePlayer).characterId &&
      !(app.target as BattlePet).petId
    const isPet = !!(app.target as BattlePet).petId
    // console.log(app.target)
    const target = app.target as any
    if (isNpc) {
      return { battleNpcId: target.battleNpcId }
    }
    if (isPlayer) {
      return { characterId: target.characterId }
    }
    if (isPet) {
      return { characterId: target.characterId, petId: target.petId }
    }
    return undefined
  }
  const onPlayerAction = () => {
    const battleScene = app.game.scene.getScene('battle') as BattleScene
    if (battleScene && app.rooms.active && hasTarget) {
      app.rooms.active.send('character:battle:action', {
        battleId: battleScene.battle.battleId,
        entity: {
          characterId: battleScene.localPlayer.character.characterId,
        },
        abilityId: 'attack',
        target: getTargetData(),
      })
    }
  }
  const onPetAction = () => {
    const battleScene = app.game.scene.getScene('battle') as BattleScene
    if (battleScene && app.rooms.active && hasTarget) {
      // console.log('send pet action')
      app.rooms.active.send('character:battle:action', {
        battleId: battleScene.battle.battleId,
        entity: {
          characterId: battleScene.localPlayer.character.characterId,
          petId: battleScene.localPlayer.character.pet.npcId,
        },
        abilityId: 'attack',
        target: getTargetData(),
      })
    }
  }

  const onLeave = () => {
    app.rooms.active?.send('character:battle:leave')
  }
  return (
    <>
      {(petCanAct || playerCanAct) && (
        <BattleActionsContainer>
          {playerCanAct && (
            <div>
              <Fab
                color="primary"
                onClick={onPlayerAction}
                disabled={!hasTarget}
              />
              <Fab
                color="primary"
                onClick={onPlayerAction}
                disabled={!hasTarget}
              />
              <Fab
                color="primary"
                onClick={onPlayerAction}
                disabled={!hasTarget}
              />
              <Fab
                color="primary"
                onClick={onPlayerAction}
                disabled={!hasTarget}
              />
            </div>
          )}
          {petCanAct && (
            <div>
              <Fab
                color="secondary"
                onClick={onPetAction}
                disabled={!hasTarget}
              />
              <Fab
                color="secondary"
                onClick={onPetAction}
                disabled={!hasTarget}
              />
              <Fab
                color="secondary"
                onClick={onPetAction}
                disabled={!hasTarget}
              />
              <Fab
                color="secondary"
                onClick={onPetAction}
                disabled={!hasTarget}
              />
            </div>
          )}
        </BattleActionsContainer>
      )}
      <ActionMenuContainer>
        <Fab />
      </ActionMenuContainer>
      <LeaveBattleContainer>
        <Fab onClick={onLeave} />
      </LeaveBattleContainer>
    </>
  )
}
