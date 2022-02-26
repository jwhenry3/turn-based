import styled from '@emotion/styled'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  TextField,
} from '@mui/material'
import { useState } from 'react'
export const CharacterCreationPanel = styled.div`
  display: flex;
`
export const CharacterPanelSide = styled.div`
  padding: 12px;
  width: 240px;
`
export const CharacterPreview = styled.div`
  width: 100%;
  height: 240px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`
export function CharacterCreation({ open, onClose, onCreate }) {
  const [name, setName] = useState('')
  const onSubmit = () => {
    onCreate({ name })
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Character Creation</DialogTitle>
      <DialogContent>
        <CharacterCreationPanel>
          <CharacterPanelSide>
            Hair
            <Slider defaultValue={1} min={1} max={10} />
            {/* <GithubPicker /> */}
            <br />
            Eyes
            <Slider defaultValue={1} min={1} max={10} />
            {/* <GithubPicker /> */}
            <br />
            Skin
            <Slider defaultValue={1} min={1} max={10} />
            {/* <GithubPicker /> */}
            <br />
            <Slider defaultValue={1} min={1} max={10} />
            <br />
            <Slider defaultValue={1} min={1} max={10} />
          </CharacterPanelSide>
          <CharacterPanelSide>
            <CharacterPreview>Character Display</CharacterPreview>
          </CharacterPanelSide>
        </CharacterCreationPanel>
        <TextField
          name="name"
          label="Character Name"
          variant="standard"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit}>Create</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
