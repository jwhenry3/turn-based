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
import { GiBroadsword, GiBowArrow, GiFire, GiExitDoor } from 'react-icons/gi'

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
    const battleScene = app.game.scene.getScene('battle') as BattleScene
    if (battleScene) {
      let called = false
      battleScene.onLocalPlayerAdded = () => {
        called = true
        const pet = battleScene.localPlayer?.pet?.model
        const player = battleScene.localPlayer?.model
        if (pet) {
          setPetCanAct(pet.canAct)
          pet.listen('canAct', (value) => {
            setPetCanAct(value)
          })
        }
        if (player) {
          setPlayerCanAct(player.canAct)
          player.listen('canAct', (value) => {
            setPlayerCanAct(value)
          })
        }
      }
      const pet = battleScene.localPlayer?.pet?.model
      const player = battleScene.localPlayer?.model
      if (player && !called) {
        battleScene.onLocalPlayerAdded()
      }
    }
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
  const onPlayerAction = (abilityId?: 'melee' | 'ranged' | 'magic') => {
    const battleScene = app.game.scene.getScene('battle') as BattleScene
    if (!app.target || app.target === battleScene?.localPlayer.model) {
      return
    }
    if (battleScene && app.rooms.active) {
      app.rooms.active.send('character:battle:action', {
        battleId: battleScene.battle.battleId,
        entity: {
          characterId: battleScene.localPlayer.character.characterId,
        },
        abilityId: abilityId || 'attack',
        target: getTargetData(),
      })
    }
  }
  const onPetAction = (abilityId?: 'melee' | 'ranged' | 'magic') => {
    const battleScene = app.game.scene.getScene('battle') as BattleScene
    if (!app.target || app.target === battleScene?.localPlayer.pet.model) {
      return
    }
    if (battleScene && app.rooms.active) {
      // console.log('send pet action')
      app.rooms.active.send('character:battle:action', {
        battleId: battleScene.battle.battleId,
        entity: {
          characterId: battleScene.localPlayer.character.characterId,
          petId: battleScene.localPlayer.character.pet.npcId,
        },
        abilityId: abilityId || 'attack',
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
              <Fab color="primary" onClick={() => onPlayerAction()}>
                <GiBroadsword size={32} />
              </Fab>
              <Fab color="primary" onClick={() => onPlayerAction('ranged')}>
                <GiBowArrow size={32} />
              </Fab>
              <Fab color="primary" onClick={() => onPlayerAction('magic')}>
                <GiFire size={32} />
              </Fab>
              <Fab color="primary" onClick={() => onPlayerAction()} />
            </div>
          )}
          {petCanAct && (
            <div>
              <Fab color="secondary" onClick={() => onPetAction()}>
                <GiBroadsword size={32} />
              </Fab>
              <Fab color="secondary" onClick={() => onPetAction('ranged')}>
                <GiBowArrow size={32} />
              </Fab>
              <Fab color="secondary" onClick={() => onPetAction('magic')}>
                <GiFire size={32} />
              </Fab>
              <Fab color="secondary" onClick={() => onPetAction()}>
                <GiBroadsword size={32} />
              </Fab>
            </div>
          )}
        </BattleActionsContainer>
      )}
      <ActionMenuContainer>
        <Fab />
      </ActionMenuContainer>
      <LeaveBattleContainer>
        <Fab onClick={onLeave}>
          <GiExitDoor size={32} />
        </Fab>
      </LeaveBattleContainer>
    </>
  )
}
