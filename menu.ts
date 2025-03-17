import * as ecs from '@8thwall/ecs'
import {createHtmlInput} from './create-textbox'
import {getUserText, createTextEntity} from './handle-text'

const createMenuButton = (text: string, onClick: () => void): HTMLButtonElement => {
  const button = document.createElement('button')
  button.innerText = text
  button.style.margin = '5px'
  button.style.padding = '10px'
  button.style.cursor = 'pointer'
  button.addEventListener('click', onClick)
  return button
}
export const createMenu = (): void => {
  const menuDiv = document.createElement('div')

  menuDiv.id = 'entity-menu'
  menuDiv.style.position = 'absolute'
  menuDiv.style.top = '10px'
  menuDiv.style.left = '10px'
  menuDiv.style.background = '#ffffff'
  menuDiv.style.padding = '10px'
  menuDiv.style.borderRadius = '5px'
  menuDiv.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.1)'

  const button1 = createMenuButton('Create Textbox', createHtmlInput)
  const button2 = createMenuButton('Retrieve User Text', () => {
    alert(getUserText())
  })
  const button3 = createMenuButton('Spawn Entity', () => {
    const world = {} as any  // Placeholder for ECS world instance
    const position = {x: 0, y: 0, z: 0}  // Example position
    createTextEntity(world, position, getUserText())
  })

  menuDiv.appendChild(button1)
  menuDiv.appendChild(button2)
  menuDiv.appendChild(button3)

  document.body.appendChild(menuDiv)
}
