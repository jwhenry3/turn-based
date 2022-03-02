import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'

export const WindowContainer = styled.div`
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.75);
  border: 2px solid rgba(250, 250, 150, 0.5);
  color: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
`
export function WindowPanel({
  children,
  style,
}: PropsWithChildren<{ style?: any }>) {
  return <WindowContainer style={style}>{children}</WindowContainer>
}
