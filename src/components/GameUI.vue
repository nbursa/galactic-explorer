<template>
  <div class="game-ui">
    <div class="level">Level: {{ level }}</div>
    <div class="score">Score: {{ score }}</div>
    <div class="health">Health: {{ health }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GameUI',
  props: {
    level: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    health: {
      type: Number,
      required: true
    }
  },
  setup() {}
})
</script>

<style scoped>
.game-ui {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
}
.score,
.health {
  margin: 5px;
}
</style>
