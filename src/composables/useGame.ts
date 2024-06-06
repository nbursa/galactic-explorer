import type { Ref } from 'vue'
import * as THREE from 'three'
import { levelConfig, findEdgeSpot } from '@/config/gameConfig'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { usePlayer } from '@/composables/usePlayer'
import { useGround } from '@/composables/useGround'
import { useObstacles } from '@/composables/useObstacles'
import { usePOIs } from '@/composables/usePOIs'
import { getKeyboardState } from '@/utils/keyboard'

export const useGame = (
  canvasContainer: Ref<HTMLElement | null>,
  emit: (event: string, ...args: any[]) => void
) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  const { player, updatePlayer, addPlayer } = usePlayer(camera, getKeyboardState)
  const { addGround } = useGround()
  const { obstacles, addRock, addFlora } = useObstacles()
  const { pois, addPOI } = usePOIs()
  let pointerControls: PointerLockControls | null = null
  let interactionKey: HTMLElement | null = null

  const occupiedPositions = new Set<string>()
  let movementX = 0

  const getPositionKey = (x: number, y: number, z: number): string => `${x},${y},${z}`

  // const isPositionFree = (x: number, y: number, z: number): boolean => {
  //   return !occupiedPositions.has(getPositionKey(x, y, z))
  // }

  const addPosition = (x: number, y: number, z: number) => {
    occupiedPositions.add(getPositionKey(x, y, z))
  }

  const initPointerControls = () => {
    if (pointerControls) {
      scene.remove(pointerControls.getObject())
    }
    pointerControls = new PointerLockControls(camera, renderer.domElement)

    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === renderer.domElement) {
        pointerControls?.lock()
      } else {
        pointerControls?.unlock()
      }
    })

    renderer.domElement.addEventListener('click', () => {
      renderer.domElement.requestPointerLock()
    })

    scene.add(pointerControls.getObject())
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  const checkInteraction = () => {
    if (!player.value) return

    let interactionFound = false
    for (const poi of pois) {
      const distance = player.value.position.distanceTo(poi.position)
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
    if (!player.value) return

    if (event.code === 'KeyE') {
      for (const poi of pois) {
        const distance = player.value.position.distanceTo(poi.position)
        const poiColor = (poi.material as THREE.MeshStandardMaterial).color.getHex()
        if (distance < 1 && poiColor !== 0x00ff00) {
          ;(poi.material as THREE.MeshStandardMaterial).color.set(0x00ff00)
          emit('interact', poi)
        }
      }
      checkLevelPassed()
    }
  }

  const onMouseMove = (event: MouseEvent) => {
    movementX += event.movementX || 0
  }

  document.addEventListener('mousemove', onMouseMove)

  const updateCameraPosition = () => {
    if (!pointerControls || !player.value || !pointerControls.isLocked) {
      return
    }

    const sensitivity = 0.002
    const angleChange = movementX * sensitivity

    const distanceToPlayer = 10 // Adjust this distance as needed
    const angleAroundPlayer = player.value.rotation.y + angleChange

    const offsetX = Math.sin(angleAroundPlayer) * distanceToPlayer
    const offsetZ = Math.cos(angleAroundPlayer) * distanceToPlayer

    camera.position.x = player.value.position.x + offsetX
    camera.position.y = player.value.position.y + 5 // Adjust camera height
    camera.position.z = player.value.position.z + offsetZ
    camera.lookAt(player.value.position)
  }

  const animate = () => {
    requestAnimationFrame(animate)
    updatePlayer(obstacles)
    checkInteraction()
    updateCameraPosition()
    renderer.render(scene, camera)
  }

  const resetScene = () => {
    while (scene.children.length > 0) {
      scene.remove(scene.children[0])
    }
    pois.length = 0
    obstacles.length = 0
    occupiedPositions.clear()
  }

  const init = (level: number) => {
    if (canvasContainer.value) {
      canvasContainer.value.appendChild(renderer.domElement)

      resetScene()

      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(1, 1, 1).normalize()
      scene.add(light)

      const ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)

      addGround(scene)

      const currentLevelConfig = levelConfig[level]

      if (!currentLevelConfig) {
        console.error(`Level "${level}" not found in levelConfig.`)
        return
      }

      currentLevelConfig.rocks.forEach(({ x, y, z }) => addRock(scene, x, y, z))
      currentLevelConfig.flora.forEach(({ x, y, z }) => addFlora(scene, x, y, z))
      currentLevelConfig.pois.forEach(({ x, y, z, color }) => addPOI(scene, x, y, z, color))

      addPlayer(scene, 10 + level * 2, findEdgeSpot, occupiedPositions, addPosition)

      initPointerControls()

      updateCameraPosition()
      renderer.render(scene, camera)
      animate()
    }
  }

  window.addEventListener('keydown', handleInteraction)

  return { init, animate, onWindowResize, loadLevel: init, handleInteraction }
}
