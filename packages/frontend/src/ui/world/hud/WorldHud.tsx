import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { useSceneState } from '../../../phaser/use-scene-state'
import { app } from '../../app'
import { ChatWindow } from './chat/ChatWindow'
import { MiniMap } from './map/MiniMap'
import { MainMenu } from './menu/MainMenu'
 const HudContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  pointer-events: none;
  > * {
    pointer-events: all;
  }
`
const onLogout = (e) => {
  app.rooms.lobby.send('account:logout')
  useSceneState.getState().update('lobby')
}
export function WorldHud() {
  return (
    <HudContainer>
      <ChatWindow />
      <MiniMap />
      <MainMenu />
      <Button onClick={onLogout}>Logout</Button>
    </HudContainer>
  )
}
