import styled from '@emotion/styled'
import { GameText } from '../../text/Text'

export const ChatHistoryContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
  padding-bottom: 8px;
`
export function ChatHistory() {
  return (
    <ChatHistoryContainer>
      <GameText>History</GameText>
    </ChatHistoryContainer>
  )
}
