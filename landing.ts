export const screen = () => {
  let startScreen = document.getElementById('startScreen')

  // Remove existing screen if it exists
  if (startScreen) {
    document.body.removeChild(startScreen)
  }

  startScreen = document.createElement('div')
  startScreen.id = 'startScreen'
  Object.assign(startScreen.style, {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '11',
    padding: '5vw',
    transition: 'opacity 0.3s ease-in-out',
    opacity: '0',
    overflowY: 'auto',
    boxSizing: 'border-box',
  })

  startScreen.innerHTML = `
    <div style="max-width: 90%; width: 90%; text-align: center; margin: 0 auto;">
      <h2 style="font-size: 5vw; font-weight: bold; text-align: center;">Welcome to Dasa Reflection Wall!</h2>
      <p style="margin: 15px 0; font-size: 4vw; opacity: 0.9;">Tap anywhere on the screen to create a note exactly where you click.</p>
      <p style="margin: 15px 0; font-size: 4vw; opacity: 0.9;">To delete a note, click on the 🗑️ icon and then select the note you want to remove.</p>
      <p style="margin: 15px 0; font-size: 4vw; opacity: 0.9;">To like a note, click on the 👍 icon and then select the note you want to like.</p>
      <p style="margin: 15px 0; font-size: 4vw; opacity: 0.9;">To see this screen again, tap the ℹ️ icon.</p>
      <button id="dismissBtn" style="margin-top: 25px; padding: 8px 15px; font-size: 4vw; background-color: #ff4757; color: white; border: none; border-radius: 5px; cursor: pointer; transition: 0.3s; display: block; margin-left: auto; margin-right: auto;">Got it!</button>
    </div>
  `

  document.body.appendChild(startScreen)

  // Fade-in effect
  requestAnimationFrame(() => {
    startScreen.style.opacity = '1'
  })
  function onClick() {
    startScreen.style.opacity = '0'
    setTimeout(() => document.body.removeChild(startScreen), 300)
  }

  document.getElementById('dismissBtn').addEventListener('click', onClick)
}