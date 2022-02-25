import styled from '@emotion/styled'
import { Button, TextField } from '@mui/material'
import { useState } from 'react'
import { useLobby } from '../../networking/use-lobby'
import { Register } from './Register'

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`
export function Login() {
  const lobby = useLobby()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = (e) => {
    e.preventDefault()
    lobby.current?.send('account:login', { username, password })
    return false
  }
  return isRegister ? (
    <Register onBack={() => setIsRegister(false)} />
  ) : (
    <LoginForm onSubmit={onLogin}>
      <TextField
        name="username"
        type="text"
        label="Username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <TextField
        name="password"
        type="password"
        label="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <Button type="submit">Login</Button>
      <br />
      <Button onClick={() => setIsRegister(true)} type="button">
        Register
      </Button>
    </LoginForm>
  )
}
