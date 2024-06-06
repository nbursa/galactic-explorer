import * as THREE from 'three'

export const useObstacles = () => {
  const obstacles: THREE.Mesh[] = []
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

  const addRock = (scene: THREE.Scene, x: number, y: number, z: number) => {
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

  const addFlora = (scene: THREE.Scene, x: number, y: number, z: number) => {
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

  return { obstacles, addRock, addFlora }
}
