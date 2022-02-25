import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'
import { useNpcListState } from '../../networking/state/use-npc-list-state'
import { usePlayerListState } from '../../networking/state/use-player-list-state'
import { useMap } from '../../networking/use-map'
import { Npc } from '../entities/Npc'
import { Player } from '../entities/Player'
import { useMovementInput } from '../entities/use-movement-input'

export const Grass = styled.div`
  background-color: #2a8;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
export default function Starter() {
  const { map } = useMap('starter', true)
  useMovementInput(map)

  return <></>
}
