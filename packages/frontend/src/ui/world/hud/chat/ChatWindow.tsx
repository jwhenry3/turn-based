import styled from '@emotion/styled'
import { useState } from 'react'
import { WindowPanel } from '../WindowPanel'
import { ChatHistory } from './ChatHistory'
import { ChatInput } from './ChatInput'
import { ChatToggle } from './ChatToggle'

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
`
export const ChatWindowContainer = styled.div`
  width: 50vw;
  height: 200px;
  display: flex;
  flex-direction: column;
  @media(max-width: 600px) {
    width: 100vw;
    padding-right:16px;
  }
`
export function ChatWindow() {
  const [opened, setOpened] = useState(false)
  return (
    <ChatContainer>
      <ChatWindowContainer>
        <WindowPanel style={{ display: opened ? 'flex' : 'none' }}>
          <ChatHistory />
          <ChatInput />
        </WindowPanel>
      </ChatWindowContainer>
      <ChatToggle opened={opened} onToggle={setOpened} />
    </ChatContainer>
  )
}
