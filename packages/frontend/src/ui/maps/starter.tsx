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
  const game = useRef<Phaser.Game | undefined>()
  useMovementInput(map)
  const onRef = (node) => {
    if (!game.current) {
      game.current = new Phaser.Game({
        parent: node,
        type: Phaser.AUTO,
        scale: {
          mode: Phaser.Scale.RESIZE,
          parent: node,
          width: '100%',
          height: '100%'
        },
        antialias: false,
        scene: {
          preload: () => {},
          create() {
            this.scale.on(
              'resize',
              (gameSize, baseSize, displaySize, resolution) => {
                this.cameras.resize(gameSize.width, gameSize.height)
              }
            )
          },
          update: () => {},
        },
      })
    }
  }

  return (
    <Grass
      ref={(node) => {
        if (node) {
          onRef(node)
        }
      }}
    ></Grass>
  )
}
