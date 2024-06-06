<template>
  <div class="game-view">
    <GameCanvas :level="level" @levelPassed="onLevelPassed" @interact="onInteract" />
    <GameUI :level="level" :score="score" :health="health" />
    <Controls />
    <HUD />
    <Level />
    <GameMessage ref="levelPassedMessage" @next-level="nextLevel" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as THREE from 'three'
import GameCanvas from '../components/GameCanvas.vue'
import GameUI from '../components/GameUI.vue'
import Controls from '../components/Controls.vue'
import HUD from '../components/HUD.vue'
import Level from '../components/Level.vue'
import GameMessage from '../components/GameMessage.vue'

export default defineComponent({
  name: 'GameView',
  components: {
    GameCanvas,
    GameUI,
    Controls,
    HUD,
    Level,
    GameMessage
  },
  setup() {
    const levelPassedMessage = ref<{ show: () => void } | null>(null)
    const level = ref(1)
    const score = ref(0)
    const health = ref(100)

    const onLevelPassed = () => {
      if (levelPassedMessage.value) {
        levelPassedMessage.value.show()
      }
    }

    const nextLevel = () => {
      level.value++
      // score.value = 0
      // health.value = 100
    }

    const onInteract = (poi: THREE.Mesh) => {
      console.log('Interacted with POI:', poi)
      score.value += 10
    }

    return { levelPassedMessage, level, score, health, onLevelPassed, onInteract, nextLevel }
  }
})
</script>

<style scoped>
.game-view {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
