import styled from '@emotion/styled'
import { BattleScene } from '../../../phaser/scenes/battle.scene'

const HudContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  pointer-events: none;
  > * {
    pointer-events: all;
  }
`
export function BattleHud({ battle }: { battle: BattleScene }) {
  return <HudContainer>Battle!</HudContainer>
}