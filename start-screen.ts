const screen = (html) => {
  const startScreen = document.createElement('div')
  startScreen.id = 'startScreen'
  startScreen.style.width = '100vw'
  startScreen.style.height = '100vh'
  startScreen.style.position = 'absolute'
  startScreen.style.marginTop = 'auto'
  startScreen.style.marginLeft = 'auto'
  startScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'
  startScreen.style.border = '1px solid black'

  startScreen.innerHTML = html
  startScreen.style.color = '#ffffff'
  startScreen.style.fontFamily = 'Helvetica'
  startScreen.style.textAlign = 'center'

  function onClick() {
    document.body.removeChild(startScreen)
  }

  startScreen.addEventListener('click', onClick)
  document.body.appendChild(startScreen)
}

const html = `<h4>Welcome to Dasa Reflection Wall</h4>
              <br>
              <h4>To create a note, tap anywhere on the screen</h4>
              <br>
              <h4>To delete a note, click on the 🗑️ icon</h4>
              <h4>and then select a note to be deleted</h4>
              <br>
              <h4>To like a note, click the like icon</h4>
              <br>
              <h4>To see this screen again, tap the ℹ️ icon</h4>
              `
export {screen, html}
