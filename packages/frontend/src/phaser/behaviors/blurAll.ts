export function blurAll() {
  const element = document.querySelector(':focus') as HTMLElement
  // console.log(element)
  element?.blur()
}
