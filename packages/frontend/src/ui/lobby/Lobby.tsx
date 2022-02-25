import styled from '@emotion/styled'
import {
  Button,
  Typography,
  styled as mStyled,
  Card,
  CardContent,
} from '@mui/material'
import { useLobbyState } from '../../networking/state/use-lobby-state'
import { useLobby } from '../../networking/use-lobby'
import { Characters } from './Characters'
import { Login } from './Login'

export const LobbyPage = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: #8cf;
  display: flex;
  align-items: center;
`
export const LobbyContainer = styled.div`
  margin: auto;
  max-width: 400px;
  width: 100%;
`
export const LobbyTitle = mStyled(Typography)({
  fontSize: '24px',
  color: '#f20',
  fontWeight: 800,
  textAlign: 'center',
})

export default function Lobby() {
  const state = useLobbyState()
  return (
    <LobbyPage>
      <LobbyContainer>
        <Card>
          <CardContent>
            <LobbyTitle>Petopia</LobbyTitle>
            <br />
            {!state.account && <Login />}
            {state.account && !state.account?.character && <Characters />}
            {state.account?.character && <div>Character Selected</div>}
          </CardContent>
        </Card>
      </LobbyContainer>
    </LobbyPage>
  )
}
