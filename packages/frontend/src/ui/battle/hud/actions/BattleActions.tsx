import styled from '@emotion/styled'
import { Fab } from '@mui/material'
import { useEffect, useState } from 'react'
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
  const [playerCanAct, setPlayerCanAct] = useState(false)
  const [petCanAct, setPetCanAct] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      const battleScene = app.game.scene.getScene('battle') as BattleScene
      if (battleScene) {
        if (battleScene.localPlayer?.pet?.canAct && !petCanAct) {
          setPetCanAct(true)
        }
        if (!battleScene.localPlayer?.pet?.canAct && petCanAct) {
          setPetCanAct(false)
        }
        if (battleScene.localPlayer?.canAct && !playerCanAct) {
          setPlayerCanAct(true)
        }
        if (!battleScene.localPlayer?.canAct && playerCanAct) {
          setPlayerCanAct(false)
        }
      }
    }, 500)
    return () => clearInterval(interval)
  }, [setPlayerCanAct, setPetCanAct])

  const onLeave = () => {
    app.rooms.active?.send('character:battle:leave')
  }
  return (
    <>
      {(petCanAct || playerCanAct) && (
        <BattleActionsContainer>
          <div>
            <Fab color="primary" />
            <Fab color="primary" />
            <Fab color="primary" />
            <Fab color="primary" />
          </div>
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
