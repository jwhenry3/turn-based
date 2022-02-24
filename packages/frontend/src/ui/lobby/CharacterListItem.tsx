import { ListItemButton } from '@mui/material'
import { useLobby } from '../../networking/use-lobby'

export function CharacterListItem({ character }: { character: any }) {
  const lobby = useLobby()
  const onSelect = () => {
    lobby.current?.send('characters:select', {
      characterId: character.characterId,
    })
  }
  return (
    <ListItemButton onClick={onSelect}>
      LV {character.stats.level} {character.name} - {character.position.map}
    </ListItemButton>
  )
}
