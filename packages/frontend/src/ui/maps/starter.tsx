import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'
import { useMap } from '../../networking/use-map'
import { app } from '../app'

export const Grass = styled.div`
  background-color: #2a8;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
export default function Starter() {
  useMap('starter', true)

  useEffect(() => {
    const activeScenes = app.game.scene.getScenes(true)
    if (!activeScenes.includes(app.scenes.starter)) {
      // setup
      app.game.scene.start('starter')
    }
    return () => {
      // teardown
      app.game.scene.stop('starter')
    }
  })

  return <></>
}
