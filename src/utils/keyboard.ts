const keyboard = {
  ArrowUp: false,
  ArrowLeft: false,
  ArrowDown: false,
  ArrowRight: false,
  Space: false,
  KeyE: false
}

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.code) {
    case 'ArrowUp':
      keyboard.ArrowUp = true
      break
    case 'ArrowLeft':
      keyboard.ArrowLeft = true
      break
    case 'ArrowDown':
      keyboard.ArrowDown = true
      break
    case 'ArrowRight':
      keyboard.ArrowRight = true
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
    case 'ArrowUp':
      keyboard.ArrowUp = false
      break
    case 'ArrowLeft':
      keyboard.ArrowLeft = false
      break
    case 'ArrowDown':
      keyboard.ArrowDown = false
      break
    case 'ArrowRight':
      keyboard.ArrowRight = false
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
