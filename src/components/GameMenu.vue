<template>
  <div class="game-menu">
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameMenu',
  setup() {
    const startGame = () => {
      console.log('Game Started');
    };

    return {
      startGame,
    };
  },
});
</script>

<style scoped>
.game-menu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
