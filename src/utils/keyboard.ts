const keyboard = {
  W: false,
  A: false,
  S: false,
  D: false,
  Space: false,
  KeyE: false
}

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.code) {
    case 'KeyW':
      keyboard.W = true
      break
    case 'KeyA':
      keyboard.A = true
      break
    case 'KeyS':
      keyboard.S = true
      break
    case 'KeyD':
      keyboard.D = true
      break
    case 'Space':
      keyboard.Space = true
      break
    case 'KeyE':
      keyboard.KeyE = true
      break
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  switch (event.code) {
    case 'KeyW':
      keyboard.W = false
      break
    case 'KeyA':
      keyboard.A = false
      break
    case 'KeyS':
      keyboard.S = false
      break
    case 'KeyD':
      keyboard.D = false
      break
    case 'Space':
      keyboard.Space = false
      break
    case 'KeyE':
      keyboard.KeyE = false
      break
  }
}

export const setupKeyboardHandlers = () => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
}

export const removeKeyboardHandlers = () => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
}

export const getKeyboardState = () => keyboard
