import { Button } from '@mui/material'
import { useLobbyState } from '../../networking/state/use-lobby-state'
import { useLobby } from '../../networking/use-lobby'
import { CharacterList } from './CharacterList'

export function Characters() {
  const lobby = useLobby()
  const lobbyState = useLobbyState()
  const onCreate = () => {
    const details = {
      name: 'test',
      eyes: '1',
      eyeColor: '#00aaff',
      hair: '1',
      hairColor: '#884444',
      skinColor: '#eeccaa',
      gender: 'male',
    }
    lobby.current?.send('characters:create', details)
  }
  if (!lobby.current) return <div>Loading...</div>
  return (
    <>
      {!lobbyState.account?.character && (
        <div>
          <CharacterList />
          <Button onClick={onCreate}>Create Character</Button>
        </div>
      )}
    </>
  )
}
