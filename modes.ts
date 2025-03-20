import { updateButtonStyles } from './buttons'

export let deleteMode = false;
export let likeMode = false;

export const toggleDeleteMode = (button: HTMLButtonElement) => {
  deleteMode = !deleteMode
  likeMode = false
  updateButtonStyles()
}

export const toggleLikeMode = (button: HTMLButtonElement) => {
  likeMode = !likeMode
  deleteMode = false
  updateButtonStyles()
}