<template>
  <div class="home">
    <h1>Welcome to Galactic Explorer</h1>
    <div class="controls">
      <button @click="startGame">Start Game</button>
      <RouterLink to="/about">About</RouterLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import aboutView from '@/views/AboutView.vue'

export default defineComponent({
  name: 'HomeView',
  computed: {
    aboutView() {
      return aboutView
    }
  },
  setup() {
    const router = useRouter()

    const startGame = () => {
      router.push({ name: 'game' })
    }

    return {
      startGame
    }
  }
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
