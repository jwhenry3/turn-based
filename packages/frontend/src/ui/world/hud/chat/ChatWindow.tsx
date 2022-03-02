import styled from '@emotion/styled'
import { useState } from 'react'
import { WindowPanel } from '../WindowPanel'
import { ChatHistory } from './ChatHistory'
import { ChatInput } from './ChatInput'
import { ChatToggle } from './ChatToggle'
import { useChatToggleState } from './use-chat-toggle'

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 56px;
  left: 8px;
  display: flex;
  flex-direction: column;
`
export const ChatWindowContainer = styled.div`
  width: 50vw;
  height: 200px;
  display: flex;
  flex-direction: column;
  @media (max-width: 600px) {
    width: 100vw;
    padding-right: 16px;
  }
`
export function ChatWindow() {
  const { opened } = useChatToggleState()
  return (
    <ChatContainer style={{ display: opened ? 'flex' : 'none', overflow: 'hidden' }}>
      <ChatWindowContainer>
        <WindowPanel>
          <ChatHistory />
          <ChatInput />
        </WindowPanel>
      </ChatWindowContainer>
    </ChatContainer>
  )
}
