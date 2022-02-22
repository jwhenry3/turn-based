import { useRef, useState } from 'react'

let centralAccount = { current: undefined }
let centralCharacter = { current: undefined }
export function useAccount() {
  return centralAccount
}
export function useCharacter() {
  return centralCharacter
}
export function useCharacterList() {
  const [list, setList] = useState([])
  
}
