import { Button } from '@mui/material'
import { useLobby } from '../../networking/use-lobby'

export function Register({ onBack }) {
  const lobby = useLobby()
  const onRegister = () => {
    lobby.current?.send('account:register', {
      username: 'test',
      password: 'test',
    })
  }
  return (
    <>
      <Button onClick={onRegister}>Register</Button>
      <br />
      <Button onClick={onBack}>Login</Button>
    </>
  )
}
