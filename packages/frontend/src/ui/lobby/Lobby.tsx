import styled from '@emotion/styled'
import { Typography, styled as mStyled, Card, CardContent } from '@mui/material'
import { useEffect, useState } from 'react'
import { app } from '../app'
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
  const [state, setState] = useState({ account: undefined })
  useEffect(() => {
    app.game.input.keyboard.enabled = false
    app.rooms.lobby.state.accounts.onAdd = (e) => {
      setState({ account: e })
    }
    app.rooms.lobby.state.accounts.onRemove = () => {
      setState({ account: undefined })
    }
    // setup
    app.game.scene.start('lobby')
    return () => {
      // teardown
      app.game.scene.stop('lobby')
      app.rooms.lobby.state.accounts.onAdd = undefined
      app.rooms.lobby.state.accounts.onRemove = undefined
    }
  })
  return (
    <LobbyPage>
      <LobbyContainer>
        <Card>
          <CardContent>
            <LobbyTitle>MMORPG</LobbyTitle>
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
