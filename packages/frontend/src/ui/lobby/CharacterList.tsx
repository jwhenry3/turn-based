import { List } from '@mui/material'
import { useEffect } from 'react'
import { useLobbyState } from '../../networking/state/use-lobby-state'
import { useLobby } from '../../networking/use-lobby'
import { CharacterListItem } from './CharacterListItem'

export function CharacterList() {
  const lobby = useLobby()
  const lobbyState = useLobbyState()
  const characters = lobbyState.account?.characterList || []

  const onLoadCharacters = () => {
    lobby.current?.send('characters:list')
  }
  useEffect(onLoadCharacters, [])

  if (characters.length > 0) {
    return (
      <List>
        {characters.map((character, index) => (
          <CharacterListItem
            character={character}
            key={index}
          />
        ))}
      </List>
    )
  }
  return <div>No Characters</div>
}
