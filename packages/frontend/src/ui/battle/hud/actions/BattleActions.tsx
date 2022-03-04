import styled from '@emotion/styled'
import { Fab } from '@mui/material'
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
  const onLeave = () => {
    app.rooms.active?.send('character:battle:leave')
  }
  return (
    <>
      <BattleActionsContainer>
        <div>
          <Fab color="primary" />
          <Fab color="primary" />
          <Fab color="primary" />
          <Fab color="primary" />
        </div>
      </BattleActionsContainer>
      <ActionMenuContainer>
        <Fab />
      </ActionMenuContainer>
      <LeaveBattleContainer>
        <Fab onClick={onLeave} />
      </LeaveBattleContainer>
    </>
  )
}
