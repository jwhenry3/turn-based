import styled from '@emotion/styled'
import { CharacterPanel } from './character/CharacterPanel'
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
export function WorldHud() {
  return (
    <HudContainer>
      <CharacterPanel />
      <ChatWindow />
      <MiniMap />
      <MainMenu />
    </HudContainer>
  )
}
