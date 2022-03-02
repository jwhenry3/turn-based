import { FaMapMarked } from 'react-icons/fa'
import { ToggleButton } from '../ToggleButton'
import { useMapToggleState } from './use-map-toggle-state'

export function MapToggle() {
  const { opened, toggleOpen } = useMapToggleState()
  return (
    <ToggleButton opened={opened} onToggle={toggleOpen}>
      <FaMapMarked size={24} />
    </ToggleButton>
  )
}
