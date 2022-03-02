import styled from '@emotion/styled'
import { GameText } from '../../text/Text'

export const MainMenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 8px 16px;
  height: 48px;
`
export function MainMenu() {
  return (
    <MainMenuContainer>
      <GameText>Main Menu</GameText>
    </MainMenuContainer>
  )
}
