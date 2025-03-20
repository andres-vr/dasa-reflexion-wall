import * as ecs from '@8thwall/ecs'

export const createTextInput = (callback: (text: string) => void) => {
  try {
    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Enter your text...'
    input.style.position = 'absolute'
    input.style.bottom = '10%'
    input.style.left = '50%'
    input.style.transform = 'translate(-50%, -50%)'
    input.style.padding = '10px'
    input.style.fontSize = '16px'
    input.style.border = '1px solid #ccc'
    input.style.borderRadius = '5px'
    input.style.zIndex = '10'

    document.body.appendChild(input)
    input.focus()

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && input.value.trim() !== '') {
        callback(input.value.trim())
        document.body.removeChild(input)
      }
    })
  } catch (error) {
    console.error('🚨 Error creating text input:', error)
  }
}

export const updateChildText = (parentEntityEid, world, newText) => {
  try {
    const children = Array.from(world.getChildren(parentEntityEid))
    if (children.length > 1) {
      ecs.Ui.set(world, children[0], {
        type: '3d',
        fontSize: 20,
        borderColor: '#000000',
        borderWidth: 1,
        text: newText,
      })
      ecs.Ui.set(world, children[1], {
        type: '3d',
        font: 'Helvetica',
        fontSize: 55,
        borderWidth: 0,
        borderRadius: 50,
        color: '#000000',
        background: '#FFFFFF',
        backgroundOpacity: 0,
        text: '',
        textAlign: 'center',
      })
    } else {
      console.warn('⚠️ No children found for entity:', parentEntityEid)
    }
  } catch (error) {
    console.error('🚨 Error updating child text:', error)
  }
}