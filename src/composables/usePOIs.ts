import * as THREE from 'three'

export const usePOIs = () => {
  const pois: THREE.Mesh[] = []
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

  const addPOI = (scene: THREE.Scene, x: number, y: number, z: number, color: number) => {
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

  return { pois, addPOI }
}
