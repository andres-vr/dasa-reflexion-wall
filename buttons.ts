import {screen} from './landing'
import {deleteMode, likeMode} from './modes'
import {toggleDeleteMode, toggleLikeMode} from './modes'

export const createDeleteButton = () => {
  const button = document.createElement('button')
  button.id = 'deleteButton'
  button.innerHTML = '🗑️'
  button.style.position = 'absolute'
  button.style.bottom = '20px'
  button.style.left = '10%'
  button.style.width = '50px'
  button.style.height = '50px'
  button.style.border = 'none'
  button.style.backgroundColor = 'white'
  button.style.borderRadius = '50%'
  button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'
  button.style.fontSize = '24px'
  button.style.cursor = 'pointer'
  button.style.zIndex = '10'
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease-in-out'
  button.style.display = 'flex'
  button.style.alignItems = 'center'
  button.style.justifyContent = 'center'

  document.body.appendChild(button)
  button.addEventListener('click', () => toggleDeleteMode(button))
}

export const createLikeButton = () => {
  const button = document.createElement('button')
  button.id = 'likeButton'
  button.innerHTML = '👍'
  button.style.position = 'absolute'
  button.style.bottom = '20px'
  button.style.right = '42.5%'
  button.style.width = '50px'
  button.style.height = '50px'
  button.style.border = 'none'
  button.style.backgroundColor = 'white'
  button.style.borderRadius = '50%'
  button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'
  button.style.fontSize = '24px'
  button.style.cursor = 'pointer'
  button.style.zIndex = '10'
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease-in-out'
  button.style.display = 'flex'
  button.style.alignItems = 'center'
  button.style.justifyContent = 'center'

  document.body.appendChild(button)
  button.addEventListener('click', () => toggleLikeMode(button))
}

export const createInfoButton = () => {
  const button = document.createElement('button')
  button.innerHTML = 'ℹ️'
  button.style.position = 'absolute'
  button.style.bottom = '20px'
  button.style.right = '10%'
  button.style.width = '50px'
  button.style.height = '50px'
  button.style.border = 'none'
  button.style.backgroundColor = 'white'
  button.style.borderRadius = '50%'
  button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'
  button.style.fontSize = '24px'
  button.style.cursor = 'pointer'
  button.style.zIndex = '10'
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease-in-out'
  button.style.display = 'flex'
  button.style.alignItems = 'center'
  button.style.justifyContent = 'center'

  button.addEventListener('click', () => {
    screen()
  })
  document.body.appendChild(button)
}

export const updateButtonStyles = () => {
  const deleteButton = document.getElementById('deleteButton') as HTMLButtonElement
  const likeButton = document.getElementById('likeButton') as HTMLButtonElement

  if (deleteButton) {
    deleteButton.style.backgroundColor = deleteMode ? 'red' : 'white'
    deleteButton.style.color = deleteMode ? 'white' : 'black'
    deleteButton.style.transform = deleteMode ? 'scale(1.2)' : 'scale(1)'
    deleteButton.style.display = 'flex'
    deleteButton.style.alignItems = 'center'
    deleteButton.style.justifyContent = 'center'
  }

  if (likeButton) {
    likeButton.style.backgroundColor = likeMode ? 'blue' : 'white'
    likeButton.style.color = likeMode ? 'white' : 'black'
    likeButton.style.transform = likeMode ? 'scale(1.2)' : 'scale(1)'
    likeButton.style.display = 'flex'
    likeButton.style.alignItems = 'center'
    likeButton.style.justifyContent = 'center'
  }
}