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
    const unsubscribe = app.rooms.lobby.state.accounts[
      app.rooms.lobby.sessionId
    ].listen('characterList', (e) => {
      console.log(e)
      setCharacters(e)
    })
    app.rooms.lobby?.send('characters:list')

    return () => {
      unsubscribe()
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
