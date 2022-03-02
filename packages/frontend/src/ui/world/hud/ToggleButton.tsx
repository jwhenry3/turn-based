import styled from '@emotion/styled'

export const ToggleButtonContainer = styled.div`
  border-radius: 24px;
  padding: 8px;
`
export function ToggleButton({ opened, children, onToggle }) {
  return (
    <ToggleButtonContainer
      onClick={() => onToggle(!opened)}
      style={{
        boxShadow: opened ? '0 0 15px 0 rgba(255,255,255, 0.5)' : 'none',
      }}
    >
      {children}
    </ToggleButtonContainer>
  )
}
