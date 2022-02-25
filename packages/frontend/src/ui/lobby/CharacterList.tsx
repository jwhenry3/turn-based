import { List, ListItem, ListItemText, styled } from '@mui/material'
import { useEffect } from 'react'
import { useLobbyState } from '../../networking/state/use-lobby-state'
import { useLobby } from '../../networking/use-lobby'
import { CharacterListItem } from './CharacterListItem'
export const Characters = styled(List)({
  border: '1px solid #efefef',
})
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
      <Characters>
        {characters.map((character, index) => (
          <CharacterListItem character={character} key={index} />
        ))}
      </Characters>
    )
  }
  return (
    <Characters>
      <ListItem>
        <ListItemText primary="No Characters" />
      </ListItem>
    </Characters>
  )
}
