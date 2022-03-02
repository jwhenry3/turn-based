import styled from '@emotion/styled'
import { ChatToggle } from '../chat/ChatToggle'
import { MapToggle } from '../map/MapToggle'
import { CgMenuRound } from 'react-icons/cg'

export const MainMenuContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 8px 16px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export function MainMenu() {
  return (
    <MainMenuContainer>
      <ChatToggle />
      <MapToggle />
      <CgMenuRound size={24} />
    </MainMenuContainer>
  )
}
