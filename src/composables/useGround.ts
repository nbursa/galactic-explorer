import * as THREE from 'three'

export const useGround = () => {
  const addGround = (scene: THREE.Scene) => {
    const textureLoader = new THREE.TextureLoader()
    const groundTexture = textureLoader.load('/textures/ground_texture.webp')
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(100, 100)

    const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture })
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000)
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
  }

  return { addGround }
}
