import { Button } from '@mui/material'
import { useLobbyState } from '../../networking/state/use-lobby-state'
import { useLobby } from '../../networking/use-lobby'
import { Characters } from './Characters'
import { Login } from './Login'

export default function Lobby() {
  const lobby = useLobby()
  const state = useLobbyState()
  const onLogout = () => {
    console.log('log out!')
  }
  const onSelectCharacter = () => {
    lobby.current?.send('characters:select', {
      characterId: state.account.characterList[0].characterId,
    })
  }
  return (
    <div>
      {!state.account && <Login />}
      {state.account && <Button onClick={onLogout}>Logout</Button>}
      {state.account && !state.account?.character && <Characters />}
      {state.account?.character && <div>Character Selected</div>}
    </div>
  )
}
