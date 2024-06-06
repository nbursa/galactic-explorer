type Level = {
  rocks: { x: number; y: number; z: number }[]
  flora: { x: number; y: number; z: number }[]
  pois: { x: number; y: number; z: number; color: number }[]
}

const createMaze = (level: number) => {
  const size = 10 + level * 2 // Increase maze size with each level
  const maze = generateMaze(size, size)
  const rocks: { x: number; y: number; z: number }[] = []
  const flora: { x: number; y: number; z: number }[] = []
  const occupiedPositions = new Set<string>()
  const spacing = 2

  const getPositionKey = (x: number, y: number, z: number): string => {
    return `${x},${y},${z}`
  }

  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      const posX = x * spacing
      const posZ = z * spacing
      if (maze[x][z] === 1) {
        // 1 indicates an obstacle
        if (Math.random() > 0.5) {
          rocks.push({ x: posX, y: 0.5, z: posZ })
          occupiedPositions.add(getPositionKey(posX, 0.5, posZ))
        } else {
          flora.push({ x: posX, y: 0, z: posZ })
          occupiedPositions.add(getPositionKey(posX, 0, posZ))
        }
      }
    }
  }

  return { rocks, flora, occupiedPositions }
}

const generateMaze = (width: number, height: number): number[][] => {
  const maze = Array.from({ length: width }, () => Array(height).fill(1))

  const carvePassagesFrom = (cx: number, cy: number) => {
    const directions = shuffleArray([
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ])

    for (const [dx, dy] of directions) {
      const nx = cx + dx * 2
      const ny = cy + dy * 2

      if (nx >= 0 && ny >= 0 && nx < width && ny < height && maze[nx][ny] === 1) {
        maze[nx][ny] = 0
        maze[cx + dx][cy + dy] = 0
        carvePassagesFrom(nx, ny)
      }
    }
  }

  // Create a random entry point on the edge
  let entryX = 0,
    entryY = 0
  const edge = Math.floor(Math.random() * 4)
  switch (edge) {
    case 0:
      entryX = 0
      entryY = Math.floor(Math.random() * height)
      break
    case 1:
      entryX = width - 1
      entryY = Math.floor(Math.random() * height)
      break
    case 2:
      entryX = Math.floor(Math.random() * width)
      entryY = 0
      break
    case 3:
      entryX = Math.floor(Math.random() * width)
      entryY = height - 1
      break
  }
  maze[entryX][entryY] = 0
  carvePassagesFrom(entryX, entryY)

  return maze
}

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const findFreeSpot = (
  occupiedPositions: Set<string>,
  size: number
): { x: number; y: number; z: number } => {
  const getPositionKey = (x: number, y: number, z: number): string => {
    return `${x},${y},${z}`
  }

  let x, y, z
  do {
    x = Math.floor(Math.random() * (size - 2) + 1) * 2
    y = 0.5
    z = Math.floor(Math.random() * (size - 2) + 1) * 2
  } while (occupiedPositions.has(getPositionKey(x, y, z)))

  occupiedPositions.add(getPositionKey(x, y, z))
  return { x, y, z }
}

const getRandomColor = () => {
  const colors = [0xff0000, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff] // Random colors except green
  return colors[Math.floor(Math.random() * colors.length)]
}

export const findEdgeSpot = (
  occupiedPositions: Set<string>,
  size: number
): { x: number; y: number; z: number } => {
  const getPositionKey = (x: number, y: number, z: number): string => {
    return `${x},${y},${z}`
  }

  let x, y, z
  const edges = [
    { x: 0, z: Math.floor(Math.random() * size) * 2 },
    { x: (size - 1) * 2, z: Math.floor(Math.random() * size) * 2 },
    { x: Math.floor(Math.random() * size) * 2, z: 0 },
    { x: Math.floor(Math.random() * size) * 2, z: (size - 1) * 2 }
  ]

  do {
    const edge = edges[Math.floor(Math.random() * edges.length)]
    x = edge.x
    y = 0.5
    z = edge.z
  } while (occupiedPositions.has(getPositionKey(x, y, z)))

  occupiedPositions.add(getPositionKey(x, y, z))
  return { x, y, z }
}

const generateLevelConfig = (level: number): Level => {
  const { rocks, flora, occupiedPositions } = createMaze(level)
  const pois = []

  for (let i = 0; i < level; i++) {
    pois.push({ ...findFreeSpot(occupiedPositions, 10 + level * 2), color: getRandomColor() })
  }

  return { rocks, flora, pois }
}

export const levelConfig: Record<number, Level> = {}

for (let level = 1; level <= 10; level++) {
  levelConfig[level] = generateLevelConfig(level)
}
