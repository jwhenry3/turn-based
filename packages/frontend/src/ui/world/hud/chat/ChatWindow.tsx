import styled from '@emotion/styled'
import { ChatHistory } from './ChatHistory'
import { ChatInput } from './ChatInput'

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.75);
  padding: 8px;
  border-radius: 8px;
  width: 50vw;
  height: 200px;
  display: flex;
  flex-direction: column;
  color: #fff;
`
export function ChatWindow() {
  return (
    <ChatContainer>
      <ChatHistory />
      <ChatInput />
    </ChatContainer>
  )
}
