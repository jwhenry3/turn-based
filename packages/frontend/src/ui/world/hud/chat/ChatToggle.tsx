import styled from '@emotion/styled'

export const ToggleButton = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  width: 24px;
  height: 24px;
  border-radius: 12px;
`
export function ChatToggle({ opened, onToggle }) {
  return <ToggleButton onClick={() => onToggle(!opened)}></ToggleButton>
}
