import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { GameText } from '../../text/Text'
import { useChatHistoryState } from './use-chat-history'

export const ChatHistoryContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
  padding: 4px 8px;
`
const Person = ({ color, children }: PropsWithChildren<{ color?: string }>) => {
  return <GameText style={{ color: color || '#0fa' }}>{children}: </GameText>
}
export function ChatHistory() {
  const { messages } = useChatHistoryState()
  return (
    <ChatHistoryContainer>
      {messages.map(({ messageId, type, character, message }) => (
        <GameText key={messageId}>
          <Person color={type === 'player' ? '#0fa' : '#2af'}>
            {character?.name || 'System Message'}
          </Person>
          <GameText>{message}</GameText>
        </GameText>
      ))}
    </ChatHistoryContainer>
  )
}
