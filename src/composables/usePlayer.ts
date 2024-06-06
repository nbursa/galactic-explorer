import * as THREE from 'three'
import { ref } from 'vue'

export const usePlayer = (camera: THREE.Camera, getKeyboardState: () => any) => {
  const player = ref<THREE.Mesh | null>(null)
  let canJump = false

  const checkCollision = (newPosition: THREE.Vector3, obstacles: THREE.Mesh[]): boolean => {
    for (const obstacle of obstacles) {
      const collisionThreshold = (obstacle as any).collisionSize || 1.5
      const distance = newPosition.distanceTo(obstacle.position)
      if (distance < collisionThreshold) {
        return true
      }
    }
    return false
  }

  const updatePlayer = (obstacles: THREE.Mesh[]) => {
    if (!player.value) return

    const keyboard = getKeyboardState()
    const newPosition = player.value.position.clone()

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

    if (!checkCollision(newPosition, obstacles)) {
      player.value.position.copy(newPosition)
    }
  }

  const addPlayer = (
    scene: THREE.Scene,
    size: number,
    findEdgeSpot: (
      occupiedPositions: Set<string>,
      size: number
    ) => { x: number; y: number; z: number },
    occupiedPositions: Set<string>,
    addPosition: (x: number, y: number, z: number) => void
  ) => {
    const textureLoader = new THREE.TextureLoader()
    const droidTexture = textureLoader.load('/textures/bb8bodytexture.jpg')
    const geometry = new THREE.SphereGeometry(0.5, 32, 32)
    const material = new THREE.MeshStandardMaterial({ map: droidTexture })

    const { x, y, z } = findEdgeSpot(occupiedPositions, size)

    const newPlayer = new THREE.Mesh(geometry, material)
    newPlayer.position.set(x, y, z)
    scene.add(newPlayer)
    addPosition(x, y, z)

    player.value = newPlayer
  }

  return { player, updatePlayer, addPlayer, canJump }
}
