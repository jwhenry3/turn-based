import { List, ListItem, ListItemText, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import { Character } from '../../networking/schemas/Character'
import { app } from '../app'
import { CharacterListItem } from './CharacterListItem'
export const Characters = styled(List)({
  border: '1px solid #efefef',
})
export function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([])
  useEffect(() => {
    app.rooms.lobby.state.account.characterList.onChange = (e) => {
      setCharacters(e)
    }
    app.rooms.lobby?.send('characters:list')

    return () => {
      app.rooms.lobby.state.account.characterList.onChange = undefined
    }
  }, [])

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
