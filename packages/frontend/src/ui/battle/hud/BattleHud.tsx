import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { BattleScene } from '../../../phaser/scenes/battle.scene'
import { useSceneState } from '../../../phaser/use-scene-state'
import { app } from '../../app'
import { BattleActions } from './actions/BattleActions'
import { CharacterPanel } from './character/CharacterPanel'
import { PetPanel } from './character/PetPanel'
import { TargetPanel } from './target/TargetPanel'

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
  return (
    <HudContainer>
      <BattleActions />
      <CharacterPanel />
      <PetPanel />
    </HudContainer>
  )
}
