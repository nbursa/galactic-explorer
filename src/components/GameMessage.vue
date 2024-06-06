<template>
  <div v-if="visible" class="message">
    <h2>Level passed!</h2>
    <button @click="nextLevel">Next level</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GameMessage',
  emits: ['next-level'],
  setup(_, { emit }) {
    const visible = ref(false)

    const show = () => {
      visible.value = true
    }

    const hide = () => {
      visible.value = false
    }

    const nextLevel = () => {
      console.log('Next Level')
      emit('next-level')
      hide()
    }

    return { visible, show, hide, nextLevel }
  }
})
</script>

<style scoped>
.message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  font-family: Arial, sans-serif;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}
</style>
