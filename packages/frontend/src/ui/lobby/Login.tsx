import styled from '@emotion/styled'
import { Button, FormHelperText, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { app } from '../app'
import { Register } from './Register'

export const FormErrorContainer = styled.div`
  padding-bottom: 16px;
  width: 100%;
  text-align: center;
  > * {
    text-align: center;
  }
`
export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`
export function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  useEffect(() => {
    const subscription = app.messages.lobby.subscribe(({ type, message }) => {
      console.log(type, message)
      if (
        type === 'account:login:failure' ||
        type === 'account:register:failure'
      ) {
        setFormError(message.message)
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const onRegister = ({ username, password, confirmPassword }) => {
    setFormError('')
    if (password !== confirmPassword) {
      setFormError('Password and Confirm Password must match')
      return
    }
    app.rooms.lobby?.send('account:register', {
      username,
      password,
    })
  }
  const onLogin = (e) => {
    setFormError('')
    e.preventDefault()
    app.rooms.lobby?.send('account:login', { username, password })
    return false
  }
  return (
    <>
      {formError && (
        <FormErrorContainer>
          <FormHelperText error>{formError}</FormHelperText>
        </FormErrorContainer>
      )}
      {isRegister ? (
        <Register
          onBack={() => {
            setFormError('')
            setIsRegister(false)
          }}
          onRegister={onRegister}
        />
      ) : (
        <LoginForm onSubmit={onLogin}>
          <TextField
            name="username"
            type="text"
            label="Username"
            value={username}
            variant="filled"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <TextField
            name="password"
            type="password"
            label="Password"
            variant="filled"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Button type="submit">Login</Button>
          <br />
          <Button
            onClick={() => {
              setFormError('')
              setIsRegister(true)
            }}
            type="button"
          >
            Register
          </Button>
        </LoginForm>
      )}
    </>
  )
}
