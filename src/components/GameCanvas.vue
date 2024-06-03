<template>
  <div ref="canvasContainer" class="canvas-container"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { setupKeyboardHandlers, removeKeyboardHandlers } from '@/utils/keyboard'
import { useGameLogic } from '@/hooks/useGameLogic'

export default defineComponent({
  name: 'GameCanvas',
  setup() {
    const canvasContainer = ref<HTMLElement | null>(null)
    const { init, animate, onWindowResize } = useGameLogic(canvasContainer)

    onMounted(() => {
      init()
      setupKeyboardHandlers()
      window.addEventListener('resize', onWindowResize, false)
      animate()
    })

    onUnmounted(() => {
      removeKeyboardHandlers()
      window.removeEventListener('resize', onWindowResize)
    })

    return {
      canvasContainer
    }
  }
})
</script>

<style scoped>
.canvas-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
