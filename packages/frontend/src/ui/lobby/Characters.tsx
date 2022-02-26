import { Button } from '@mui/material'
import { useState } from 'react'
import { app } from '../app'
import { CharacterList } from './CharacterList'
import { CharacterCreation } from './dialogs/CharacterCreation'

export function Characters() {
  const [createOpen, setCreateOpen] = useState(false)
  const onCreate = ({ name }) => {
    const details = {
      name,
      eyes: '1',
      eyeColor: '#00aaff',
      hair: '1',
      hairColor: '#884444',
      skinColor: '#eeccaa',
      gender: 'male',
    }
    app.rooms.lobby?.send('characters:create', details)
    setCreateOpen(false)
  }
  const onLogout = () => {
    app.rooms.lobby?.send('account:logout')
  }
  if (!app.rooms.lobby) return <div>Loading...</div>
  return (
    <div>
      <CharacterList />
      <CharacterCreation
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={onCreate}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => setCreateOpen(true)}>Create Character</Button>
        <Button onClick={onLogout}>Logout</Button>
      </div>
    </div>
  )
}
