import { Button } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useLobbyState } from '../../networking/state/use-lobby-state'
import { useLobby } from '../../networking/use-lobby'

export default function Lobby() {
  const lobby = useLobby()
  const state = useLobbyState()
  const onLogin = () => {
    lobby.current?.send('account:login')
  }
  const onLogout = () => {
    console.log('log out!')
  }
  const onLoadCharacters = () => {
    lobby.current?.send('characters:list')
  }
  const onSelectCharacter = () => {
    lobby.current?.send('characters:select', {
      id: state.account.characterList[0].id,
    })
  }
  return (
    <div>
      {(state.account && <Button onClick={onLogout}>Logout</Button>) || (
        <Button onClick={onLogin}>Log In</Button>
      )}
      {state.account && !state.account?.character && (
        <>
          {state.account.characterList.length === 0 && (
            <>
              <Button onClick={onLoadCharacters}>Load Characters</Button>
            </>
          )}
          {state.account?.characterList.length > 0 && (
            <Button onClick={onSelectCharacter}>Select Character</Button>
          )}
        </>
      )}
      {state.account?.character && <div>Character Selected</div>}
    </div>
  )
}
