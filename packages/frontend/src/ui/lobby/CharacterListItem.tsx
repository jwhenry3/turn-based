import { ListItemButton, ListItemText } from '@mui/material'
import { useAuthState } from '../../networking/state/use-auth-state'
import { useLobbyState } from '../../networking/state/use-lobby-state'
import { useSceneState } from '../../networking/state/use-scene-state'
import { app } from '../app'

export function CharacterListItem({ character }: { character: any }) {
  const lobbyState = useLobbyState()
  const auth = useAuthState()
  const { update } = useSceneState()
  const onSelect = () => {
    app.rooms.lobby?.send('characters:select', {
      characterId: character.characterId,
    })
    auth.update(lobbyState.account.token.token, character.characterId)
    update(character.position.map)
  }
  return (
    <ListItemButton onClick={onSelect}>
      <ListItemText
        primary={
          <>
            LV {character.stats.level} {character.name} -{' '}
            {character.position.map}
          </>
        }
      />
    </ListItemButton>
  )
}
