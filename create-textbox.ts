export const createHtmlInput = (): void => {
  let inputDiv = document.getElementById('ar-text-input') as HTMLDivElement
  if (!inputDiv) {
    inputDiv = document.createElement('div') as HTMLDivElement
    inputDiv.id = 'ar-text-input'
    inputDiv.style.position = 'absolute'
    inputDiv.style.bottom = '20px'
    inputDiv.style.left = '50%'
    inputDiv.style.transform = 'translateX(-50%)'
    inputDiv.style.background = '#ffffff'
    inputDiv.style.padding = '10px'
    inputDiv.style.borderRadius = '5px'
    inputDiv.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.1)'

    const input = document.createElement('input') as HTMLInputElement
    input.type = 'text'
    input.id = 'userTextInput'
    input.placeholder = 'Enter your text...'
    input.style.padding = '5px'
    input.style.fontSize = '16px'

    inputDiv.appendChild(input)
    document.body.appendChild(inputDiv)
  }
}