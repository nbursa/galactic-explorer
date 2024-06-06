<template>
  <div ref="canvasContainer" class="canvas-container"></div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue'
import { setupKeyboardHandlers, removeKeyboardHandlers } from '@/utils/keyboard'
import { useGame } from '@/composables/useGame'

export default defineComponent({
  name: 'GameCanvas',
  props: {
    level: {
      type: Number,
      required: true
    }
  },
  emits: ['levelPassed', 'interact'],
  setup(props, { emit }) {
    const canvasContainer = ref<HTMLElement | null>(null)
    const { init, animate, onWindowResize, handleInteraction } = useGame(canvasContainer, emit)

    const loadLevel = (level: number) => {
      init(level)
      animate()
    }

    onMounted(() => {
      loadLevel(props.level)
      setupKeyboardHandlers()
      window.addEventListener('resize', onWindowResize, false)
      window.addEventListener('keydown', handleInteraction, false)
    })

    onUnmounted(() => {
      removeKeyboardHandlers()
      window.removeEventListener('resize', onWindowResize)
      window.removeEventListener('keydown', handleInteraction)
    })

    watch(
      () => props.level,
      (newLevel) => {
        loadLevel(newLevel)
      }
    )

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
