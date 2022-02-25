import { Button } from '@mui/material'
import { useState } from 'react'
import { useLobby } from '../../networking/use-lobby'
import { CharacterList } from './CharacterList'
import { CharacterCreation } from './dialogs/CharacterCreation'

export function Characters() {
  const lobby = useLobby()
  const [createOpen, setCreateOpen] = useState(false)
  const onCreate = ({name}) => {
    const details = {
      name,
      eyes: '1',
      eyeColor: '#00aaff',
      hair: '1',
      hairColor: '#884444',
      skinColor: '#eeccaa',
      gender: 'male',
    }
    lobby.current?.send('characters:create', details)
    setCreateOpen(false)
  }
  const onLogout = () => {
    lobby.current?.send('account:logout')
  }
  if (!lobby.current) return <div>Loading...</div>
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
