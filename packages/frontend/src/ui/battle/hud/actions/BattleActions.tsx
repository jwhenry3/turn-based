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
export function BattleActions() {
  const [hasTarget, setHasTarget] = useState(false)
  const [playerCanAct, setPlayerCanAct] = useState(false)
  const [petCanAct, setPetCanAct] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      const battleScene = app.game.scene.getScene('battle') as BattleScene
      if (battleScene) {
        if (battleScene.localPlayer?.pet?.model.canAct && !petCanAct) {
          setPetCanAct(true)
        }
        if (!battleScene.localPlayer?.pet?.model.canAct && petCanAct) {
          setPetCanAct(false)
        }
        if (battleScene.localPlayer?.model.canAct && !playerCanAct) {
          setPlayerCanAct(true)
        }
        if (!battleScene.localPlayer?.model.canAct && playerCanAct) {
          setPlayerCanAct(false)
        }
        if (app.target && !hasTarget) {
          setHasTarget(true)
        } else if (!app.target && hasTarget) {
          setHasTarget(false)
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
    console.log(app.target)
    return {
      targetType: isNpc ? 'npc' : isPet ? 'pet' : isPlayer ? 'player' : '',
      targetId: (app.target as BattleNpc).battleNpcId
        ? (app.target as BattleNpc).battleNpcId
        : (app.target as BattlePlayer | BattlePet).characterId,
    }
  }
  const onPlayerAction = () => {
    const battleScene = app.game.scene.getScene('battle') as BattleScene
    if (battleScene && app.rooms.active && hasTarget) {
      console.log('send player action')
      console.log(getTargetData())
      app.rooms.active.send('character:battle:action', {
        battleId: battleScene.battle.battleId,
        entityType: 'player',
        abilityId: 'test',
        ...getTargetData(),
      })
    }
  }
  const onPetAction = () => {
    const battleScene = app.game.scene.getScene('battle') as BattleScene
    if (battleScene && app.rooms.active && hasTarget) {
      console.log('send pet action')
      app.rooms.active.send('character:battle:action', {
        battleId: battleScene.battle.battleId,
        entityType: 'pet',
        abilityId: 'test',
        ...getTargetData(),
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
                color="primary"
                onClick={onPetAction}
                disabled={!hasTarget}
              />
              <Fab
                color="primary"
                onClick={onPetAction}
                disabled={!hasTarget}
              />
              <Fab
                color="primary"
                onClick={onPetAction}
                disabled={!hasTarget}
              />
              <Fab
                color="primary"
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
