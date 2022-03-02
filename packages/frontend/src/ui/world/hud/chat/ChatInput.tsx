import styled from '@emotion/styled'

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
  return (
    <ChatInputContainer>
      <ChatInputField type="text" />
    </ChatInputContainer>
  )
}
