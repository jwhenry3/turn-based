import { ListItemButton, ListItemText } from '@mui/material'
import { useAuthState } from '../../networking/state/use-auth-state'
import { useLobbyState } from '../../networking/state/use-lobby-state'
import { useSceneState } from '../../networking/state/use-scene-state'
import { useLobby } from '../../networking/use-lobby'

export function CharacterListItem({ character }: { character: any }) {
  const lobby = useLobby()
  const lobbyState = useLobbyState()
  const auth = useAuthState()
  const {scene, update} = useSceneState()
  const onSelect = () => {
    lobby.current?.send('characters:select', {
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
