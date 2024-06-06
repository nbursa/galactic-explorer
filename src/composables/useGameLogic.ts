import type { Ref } from 'vue'
import * as THREE from 'three'
import { getKeyboardState } from '@/utils/keyboard'
import { TextureLoader } from 'three'
import { levelConfig, findEdgeSpot } from '@/config/gameConfig'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

export const useGameLogic = (
  canvasContainer: Ref<HTMLElement | null>,
  emit: (event: string, ...args: any[]) => void
) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  let character: THREE.Mesh
  const pois: THREE.Mesh[] = []
  const obstacles: THREE.Mesh[] = []
  let canJump = false
  let interactionKey: HTMLElement | null = null

  const occupiedPositions = new Set<string>()

  const getPositionKey = (x: number, y: number, z: number): string => {
    return `${x},${y},${z}`
  }

  const isPositionFree = (x: number, y: number, z: number): boolean => {
    return !occupiedPositions.has(getPositionKey(x, y, z))
  }

  const addPosition = (x: number, y: number, z: number) => {
    occupiedPositions.add(getPositionKey(x, y, z))
  }

  let pointerControls: PointerLockControls | null = null

  const initPointerControls = () => {
    pointerControls = new PointerLockControls(camera, renderer.domElement)
    if (!pointerControls) return

    const pointerlockchange = () => {
      if (document.pointerLockElement === renderer.domElement) {
        pointerControls!.lock()
      } else {
        pointerControls!.unlock()
      }
    }

    document.addEventListener('pointerlockchange', pointerlockchange)

    const onClick = () => {
      renderer.domElement.requestPointerLock()
    }

    renderer.domElement.addEventListener('click', onClick)

    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (pointerControls && pointerControls.isLocked) {
        const movementX = event.movementX || 0
        const sensitivity = 0.002
        camera.rotation.y -= movementX * sensitivity
      }
    })

    scene.add(pointerControls.getObject())

    return pointerControls
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  const addGround = () => {
    const textureLoader = new TextureLoader()
    const groundTexture = textureLoader.load('/textures/ground_texture.webp')
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(100, 100)

    const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture })
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000)
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
  }

  const addRock = (x: number, y: number, z: number) => {
    if (isPositionFree(x, y, z)) {
      const rockGeometry = new THREE.DodecahedronGeometry(1, 0)
      const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
      const rock = new THREE.Mesh(rockGeometry, rockMaterial)
      rock.position.set(x, y, z)
      ;(rock as any).collisionSize = 1.4
      scene.add(rock)
      obstacles.push(rock)
      addPosition(x, y, z)
    }
  }

  const addFlora = (x: number, y: number, z: number) => {
    if (isPositionFree(x, y, z)) {
      const floraGeometry = new THREE.ConeGeometry(0.5, 2, 8)
      const floraMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 })
      const flora = new THREE.Mesh(floraGeometry, floraMaterial)
      flora.position.set(x, y + 1, z)
      ;(flora as any).collisionSize = 1
      scene.add(flora)
      obstacles.push(flora)
      addPosition(x, y, z)
    }
  }

  const addPOI = (x: number, y: number, z: number, color: number) => {
    if (isPositionFree(x, y, z)) {
      const poiGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
      const poiMaterial = new THREE.MeshStandardMaterial({ color })
      const poi = new THREE.Mesh(poiGeometry, poiMaterial)
      poi.position.set(x, y, z)
      scene.add(poi)
      pois.push(poi)
      addPosition(x, y, z)
    }
  }

  const addCharacter = (size: number) => {
    const textureLoader = new THREE.TextureLoader()
    const droidTexture = textureLoader.load('/textures/bb8bodytexture.jpg')
    const geometry = new THREE.SphereGeometry(0.5, 32, 32)
    const material = new THREE.MeshStandardMaterial({ map: droidTexture })

    const { x, y, z } = findEdgeSpot(occupiedPositions, size) // Use the new function to find an edge spot

    character = new THREE.Mesh(geometry, material)
    character.position.set(x, y, z)
    scene.add(character)
    addPosition(x, y, z)
  }

  const checkCollision = (newPosition: THREE.Vector3): boolean => {
    for (const obstacle of obstacles) {
      const collisionThreshold = (obstacle as any).collisionSize || 1.5
      const distance = newPosition.distanceTo(obstacle.position)
      if (distance < collisionThreshold) {
        return true
      }
    }
    return false
  }

  const updateCharacter = () => {
    const keyboard = getKeyboardState()
    const newPosition = character.position.clone()

    const direction = new THREE.Vector3()

    if (keyboard.W) {
      camera.getWorldDirection(direction)
      direction.y = 0
      direction.normalize()
      direction.multiplyScalar(0.05)
      newPosition.add(direction)
    }
    if (keyboard.S) {
      camera.getWorldDirection(direction)
      direction.y = 0
      direction.normalize()
      direction.multiplyScalar(0.05)
      newPosition.sub(direction)
    }
    if (keyboard.A) {
      camera.getWorldDirection(direction)
      direction.y = 0
      direction.normalize()
      direction.cross(camera.up)
      direction.multiplyScalar(0.05)
      newPosition.sub(direction)
    }
    if (keyboard.D) {
      camera.getWorldDirection(direction)
      direction.y = 0
      direction.normalize()
      direction.cross(camera.up)
      direction.multiplyScalar(0.05)
      newPosition.add(direction)
    }
    if (keyboard.Space && canJump) {
      newPosition.y += 0.2
      canJump = false
    }
    if (newPosition.y > 1) {
      newPosition.y -= 0.05
    } else {
      canJump = true
    }

    if (!checkCollision(newPosition)) {
      character.position.copy(newPosition)
    }
  }

  const checkInteraction = () => {
    let interactionFound = false
    for (const poi of pois) {
      const distance = character.position.distanceTo(poi.position)
      if (distance < 1) {
        interactionFound = true
        if (!interactionKey) {
          interactionKey = document.createElement('div')
          interactionKey.innerText = 'Press E to interact'
          interactionKey.style.position = 'absolute'
          interactionKey.style.top = `${window.innerHeight / 2 + 100}px`
          interactionKey.style.left = `${window.innerWidth / 2 - 60}px`
          interactionKey.style.color = 'white'
          document.body.appendChild(interactionKey)
        }
      }
    }

    if (!interactionFound && interactionKey) {
      document.body.removeChild(interactionKey)
      interactionKey = null
    }
  }

  const checkLevelPassed = () => {
    const allGreen = pois.every(
      (poi) => (poi.material as THREE.MeshStandardMaterial).color.getHex() === 0x00ff00
    )
    if (allGreen) {
      emit('levelPassed')
    }
  }

  const handleInteraction = (event: KeyboardEvent) => {
    if (event.code === 'KeyE') {
      for (const poi of pois) {
        const distance = character.position.distanceTo(poi.position)
        const poiColor = (poi.material as THREE.MeshStandardMaterial).color.getHex()
        if (distance < 1 && poiColor !== 0x00ff00) {
          ;(poi.material as THREE.MeshStandardMaterial).color.set(0x00ff00)
          emit('interact', poi)
        }
      }
      checkLevelPassed()
    }
  }

  let movementX = 0

  const onMouseMove = (event: MouseEvent) => {
    movementX += event.movementX || 0
  }

  document.addEventListener('mousemove', onMouseMove)

  const updateCameraPosition = () => {
    if (!pointerControls || pointerControls.isLocked) {
      const sensitivity = 0.002
      const angleChange = movementX * sensitivity

      const distanceToCharacter = 10 // Adjust this distance as needed
      const angleAroundCharacter = character.rotation.y + angleChange

      const offsetX = Math.sin(angleAroundCharacter) * distanceToCharacter
      const offsetZ = Math.cos(angleAroundCharacter) * distanceToCharacter

      camera.position.x = character.position.x + offsetX
      camera.position.y = character.position.y + 5 // Adjust camera height
      camera.position.z = character.position.z + offsetZ
      camera.lookAt(character.position)
    }
  }

  const animate = () => {
    requestAnimationFrame(animate)
    updateCharacter()
    checkInteraction()

    updateCameraPosition()

    renderer.render(scene, camera)
  }

  const init = (level: number) => {
    if (canvasContainer.value) {
      canvasContainer.value.appendChild(renderer.domElement)
      pointerControls = initPointerControls() || null

      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(1, 1, 1).normalize()
      scene.add(light)

      const ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)

      addGround()

      const currentLevelConfig = levelConfig[level]

      if (!currentLevelConfig) {
        console.error(`Level "${level}" not found in levelConfig.`)
        return
      }

      occupiedPositions.clear()
      currentLevelConfig.rocks.forEach(({ x, y, z }) => addRock(x, y, z))
      currentLevelConfig.flora.forEach(({ x, y, z }) => addFlora(x, y, z))
      currentLevelConfig.pois.forEach(({ x, y, z, color }) => addPOI(x, y, z, color))

      addCharacter(10 + level * 2)

      updateCameraPosition()
      renderer.render(scene, camera)
      animate()
    }
  }

  window.addEventListener('keydown', handleInteraction)

  return { init, animate, onWindowResize, loadLevel: init, handleInteraction }
}
