import styled from '@emotion/styled'
import { useState } from 'react'
import { app } from '../../../app'
import { useChatHistoryState } from './use-chat-history'

export const ChatInputContainer = styled.div`
  display: flex;
  background-color: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  height: 32px;
`

export const ChatInputField = styled.input`
  appearance: none;
  background-color: transparent;
  flex: 1;
  padding: 8px;
  color: #fff;
  font-size: 16px;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: 0.02rem;
  text-shadow: 1px 1px #000, -1px -1px #000, -1px 1px #000, 1px -1px #000,
    -1px 0 #000, 1px 0 #000, 0 1px #000, 0 -1px #000;
`
export function ChatInput() {
  const [text, setText] = useState('')
  const { addMessage } = useChatHistoryState()
  const onKey = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      app.rooms.active?.send('chat:map', { message: text })
      setText('')
    }
  }
  return (
    <ChatInputContainer>
      <ChatInputField
        type="text"
        onFocus={(e) => {
          if (!app.focusedUi.includes(e.target)) {
            app.focusedUi.push(e.target)
          }
        }}
        onBlur={(e) => {
          if (app.focusedUi.includes(e.target)) {
            app.focusedUi.splice(app.focusedUi.indexOf(e.target), 1)
          }
        }}
        onKeyUp={onKey}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
    </ChatInputContainer>
  )
}
