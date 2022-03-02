import styled from '@emotion/styled'

export const ChatInputContainer = styled.div`
  display: flex;
  background-color: rgba(160, 160, 255, 0.5);
  border-radius: 8px;
  height: 32px;
  margin-left: -8px;
  margin-right: -8px;
  margin-bottom: -8px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
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
