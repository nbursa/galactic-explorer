<template>
  <div class="game-view">
    <GameCanvas />
    <GameUI />
    <Controls />
    <HUD />
    <Level />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GameCanvas from '../components/GameCanvas.vue';
import GameUI from '../components/GameUI.vue';
import Controls from '../components/Controls.vue';
import HUD from '../components/HUD.vue';
import Level from '../components/Level.vue';

export default defineComponent({
  name: 'GameView',
  components: {
    GameCanvas,
    GameUI,
    Controls,
    HUD,
    Level,
  },
});
</script>

<style scoped>
.game-view {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
