import { ListItemButton, ListItemText } from '@mui/material'
import { useSceneState } from '../../phaser/use-scene-state'
import { app } from '../app'

export function CharacterListItem({ character }: { character: any }) {
  const { update } = useSceneState()
  const onSelect = () => {
    app.rooms.lobby?.send('characters:select', {
      characterId: character.characterId,
    })
    const account = app.rooms.lobby.state.accounts[app.rooms.lobby.sessionId]
    app.auth.token = account.token.token
    app.auth.characterId = character.characterId
    app.character = character
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
