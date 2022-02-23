import { Button } from '@mui/material'
import { useState } from 'react'
import { useLobby } from '../../networking/use-lobby'
import { Register } from './Register'

export function Login() {
  const lobby = useLobby()
  const [isRegister, setIsRegister] = useState(false)

  const onLogin = () => {
    lobby.current?.send('account:login', { username: 'test', password: 'test' })
  }
  return isRegister ? (
    <Register onBack={() => setIsRegister(false)} />
  ) : (
    <>
      <Button onClick={onLogin}>Login</Button>
      <br />
      <Button onClick={() => setIsRegister(true)}>Register</Button>
    </>
  )
}
