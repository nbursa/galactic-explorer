import type { Ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getKeyboardState } from '@/utils/keyboard'
import { TextureLoader } from 'three'

export const useGameLogic = (canvasContainer: Ref<HTMLElement | null>) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  let character: THREE.Mesh
  let poi: THREE.Mesh
  const obstacles: THREE.Mesh[] = []
  let canJump = false
  let interactionKey: HTMLElement | null = null

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
    const rockGeometry = new THREE.DodecahedronGeometry(1, 0)
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
    const rock = new THREE.Mesh(rockGeometry, rockMaterial)
    rock.position.set(x, y, z)
    scene.add(rock)
    obstacles.push(rock)
  }

  const addFlora = (x: number, y: number, z: number) => {
    const floraGeometry = new THREE.ConeGeometry(0.5, 2, 8)
    const floraMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 })
    const flora = new THREE.Mesh(floraGeometry, floraMaterial)
    flora.position.set(x, y + 1, z)
    scene.add(flora)
    obstacles.push(flora)
  }

  const addCharacter = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32)
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff })
    character = new THREE.Mesh(geometry, material)
    character.position.y = 1
    scene.add(character)
  }

  const addPOI = () => {
    const poiGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const poiMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    poi = new THREE.Mesh(poiGeometry, poiMaterial)
    poi.position.set(2, 0.5, 0)
    scene.add(poi)
  }

  const checkCollision = (newPosition: THREE.Vector3): boolean => {
    for (const obstacle of obstacles) {
      const distance = newPosition.distanceTo(obstacle.position)
      if (distance < 1.5) {
        return true
      }
    }
    return false
  }

  const updateCharacter = () => {
    const keyboard = getKeyboardState()
    const newPosition = character.position.clone()

    if (keyboard.ArrowUp) {
      newPosition.z -= 0.05
    }
    if (keyboard.ArrowDown) {
      newPosition.z += 0.05
    }
    if (keyboard.ArrowLeft) {
      newPosition.x -= 0.05
    }
    if (keyboard.ArrowRight) {
      newPosition.x += 0.05
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
    const distance = character.position.distanceTo(poi.position)
    if (distance < 1) {
      if (!interactionKey) {
        interactionKey = document.createElement('div')
        interactionKey.innerText = 'Press E to interact'
        interactionKey.style.position = 'absolute'
        interactionKey.style.top = `${window.innerHeight / 2}px`
        interactionKey.style.left = `${window.innerWidth / 2}px`
        interactionKey.style.color = 'white'
        document.body.appendChild(interactionKey)
      }
    } else {
      if (interactionKey) {
        document.body.removeChild(interactionKey)
        interactionKey = null
      }
    }
  }

  const handleInteraction = (event: KeyboardEvent) => {
    if (event.code === 'KeyE') {
      const distance = character.position.distanceTo(poi.position)
      if (distance < 1) {
        console.log('Interacted with POI')
      }
    }
  }

  const animate = () => {
    requestAnimationFrame(animate)
    updateCharacter()
    checkInteraction()

    camera.position.set(character.position.x, character.position.y + 2, character.position.z + 2)
    camera.lookAt(character.position)

    renderer.render(scene, camera)
  }

  const init = () => {
    if (canvasContainer.value) {
      canvasContainer.value.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.update()

      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(1, 1, 1).normalize()
      scene.add(light)

      const ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)

      addGround()
      addRock(2, 0.5, 2)
      addRock(-2, 0.5, -2)
      addFlora(3, 0, 3)
      addFlora(-3, 0, -3)

      camera.position.set(5, 5, 5)
      camera.lookAt(new THREE.Vector3(0, 0, 0))

      addCharacter()
      addPOI()
    }
  }

  window.addEventListener('keydown', handleInteraction)

  return { init, animate, onWindowResize }
}
