import { MdOutlineChatBubble } from 'react-icons/md'
import { ToggleButton } from '../ToggleButton'
import { useChatToggleState } from './use-chat-toggle'

export function ChatToggle() {
  const { opened, toggleOpen } = useChatToggleState()
  return (
    <ToggleButton opened={opened} onToggle={toggleOpen}>
      <MdOutlineChatBubble size={24} onClick={() => toggleOpen(!opened)} />
    </ToggleButton>
  )
}
