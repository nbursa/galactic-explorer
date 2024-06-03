<template>
  <div class="game-ui">
    <div class="score">Score: {{ score }}</div>
    <div class="health">Health: {{ health }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'GameUI',
  setup() {
    const score = ref(0);
    const health = ref(100);

    return {
      score,
      health,
    };
  },
});
</script>

<style scoped>
.game-ui {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
}
.score, .health {
  margin: 5px;
}
</style>
