import { ListItemButton } from '@mui/material'
import { useAuthState } from '../../networking/state/use-auth-state'
import { useLobbyState } from '../../networking/state/use-lobby-state'
import { useLobby } from '../../networking/use-lobby'

export function CharacterListItem({ character }: { character: any }) {
  const lobby = useLobby()
  const lobbyState = useLobbyState()
  const auth = useAuthState()
  const onSelect = () => {
    lobby.current?.send('characters:select', {
      characterId: character.characterId,
    })
    auth.update(lobbyState.account.token.token, character.characterId)
  }
  return (
    <ListItemButton onClick={onSelect}>
      LV {character.stats.level} {character.name} - {character.position.map}
    </ListItemButton>
  )
}
