type Level = {
  rocks: { x: number; y: number; z: number }[]
  flora: { x: number; y: number; z: number }[]
  pois: { x: number; y: number; z: number; color: number }[]
}

const createMaze = () => {
  const rocks: { x: number; y: number; z: number }[] = []
  const flora: { x: number; y: number; z: number }[] = []
  const occupiedPositions = new Set<string>()
  const size = 10
  const spacing = 2

  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      if (Math.random() > 0.7) {
        if (Math.random() > 0.5) {
          rocks.push({ x: x * spacing, y: 0.5, z: z * spacing })
          occupiedPositions.add(`${x * spacing},${0.5},${z * spacing}`)
        } else {
          flora.push({ x: x * spacing, y: 0, z: z * spacing })
          occupiedPositions.add(`${x * spacing},${0},${z * spacing}`)
        }
      }
    }
  }

  return { rocks, flora, occupiedPositions }
}

export const levelConfig: Record<number, Level> = {
  1: {
    ...(() => {
      const { rocks, flora, occupiedPositions } = createMaze()
      const pois = []

      // Function to find a free spot
      const findFreeSpot = () => {
        let x, y, z
        do {
          x = (Math.floor(Math.random() * 21) - 10) * 2
          y = 0.5
          z = (Math.floor(Math.random() * 21) - 10) * 2
        } while (occupiedPositions.has(`${x},${y},${z}`))
        occupiedPositions.add(`${x},${y},${z}`)
        return { x, y, z }
      }

      // Add one POI for level 1
      pois.push({ ...findFreeSpot(), color: 0xff0000 })

      return { rocks, flora, pois }
    })()
  },
  2: {
    ...(() => {
      const { rocks, flora, occupiedPositions } = createMaze()
      const pois = []

      // Function to find a free spot
      const findFreeSpot = () => {
        let x, y, z
        do {
          x = (Math.floor(Math.random() * 21) - 10) * 2
          y = 0.5
          z = (Math.floor(Math.random() * 21) - 10) * 2
        } while (occupiedPositions.has(`${x},${y},${z}`))
        occupiedPositions.add(`${x},${y},${z}`)
        return { x, y, z }
      }

      // Add two POIs for level 2
      pois.push({ ...findFreeSpot(), color: 0xff0000 })
      pois.push({ ...findFreeSpot(), color: 0x0000ff })

      return { rocks, flora, pois }
    })()
  }
}
