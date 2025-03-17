import * as ecs from '@8thwall/ecs'

export const getUserText = (): string => {
  const userInput = document.getElementById('userTextInput') as HTMLInputElement
  if (!userInput) {
    console.warn('No input field found! Using default text.')
    return 'Default Text'
  }
  const textValue = userInput.value.trim()
  console.log('User entered text:', textValue)
  return textValue || 'Default Text'
}

export const createTextEntity = (world, targetEid, userText) => {
  const textEntity = world.createEntity()
  ecs.Ui.set(world, textEntity, {
    type: '3d',
    text: userText,
    fontSize: 25,
    width: '100',
    height: '100',
    followEid: targetEid,  // Make the text follow the target entity
    offsetY: 0,  // Adjust this value to position the text above the object
  })
}
