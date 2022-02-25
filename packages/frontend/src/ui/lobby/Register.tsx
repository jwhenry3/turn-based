import styled from '@emotion/styled'
import { Button, FormHelperText, TextField } from '@mui/material'
import { useState } from 'react'
export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
`
export function Register({ onBack, onRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  return (
    <RegisterForm
      onSubmit={(e) => {
        e.preventDefault()
        onRegister({ username, password, confirmPassword })
      }}
    >
      <TextField
        name="username"
        type="text"
        value={username}
        variant="filled"
        required
        label="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <TextField
        name="password"
        type="password"
        value={password}
        variant="filled"
        label="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <TextField
        name="password"
        type="password"
        label="Confirm Password"
        variant="filled"
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
