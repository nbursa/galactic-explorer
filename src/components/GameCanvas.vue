<template>
  <div ref="canvasContainer" class="canvas-container"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'GameCanvas',
  setup() {
    const canvasContainer = ref<HTMLElement | null>(null);

    onMounted(() => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (canvasContainer.value) {
        canvasContainer.value.appendChild(renderer.domElement);
      }

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 5;

      function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      }

      animate();
    });

    return {
      canvasContainer,
    };
  },
});
</script>

<style scoped>
.canvas-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
