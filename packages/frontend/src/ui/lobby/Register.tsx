import styled from '@emotion/styled'
import { Button, FormHelperText, TextField } from '@mui/material'
import { useState } from 'react'
import { useLobby } from '../../networking/use-lobby'
export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
`
export function Register({ onBack }) {
  const lobby = useLobby()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const onRegister = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setFormError('Password and Confirm Password must match')
      return false
    }
    lobby.current?.send('account:register', {
      username,
      password,
    })
    return false
  }
  return (
    <RegisterForm onSubmit={onRegister}>
      {formError && <FormHelperText error>{formError}</FormHelperText>}
      <TextField
        name="username"
        type="text"
        value={username}
        required
        label="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <TextField
        name="password"
        type="password"
        value={password}
        label="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <TextField
        name="password"
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        required
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br />
      <Button type="submit">Register</Button>
      <br />
      <Button onClick={onBack} type="button">
        Login
      </Button>
    </RegisterForm>
  )
}
