<template>
  <div id="gameCanvas"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { GameService } from '@/services/GameService';

export default defineComponent({
  name: 'Game',
  setup() {
    onMounted(() => {
      GameService.init('gameCanvas');
    });
  }
});
</script>

<style scoped>
#gameCanvas {
  width: 100%;
  height: 100vh;
}
</style>
