<template>
  <div class="about">
    <h1>About Galactic Explorer</h1>
    <p>Galactic Explorer is a sci-fi themed platform game where you navigate through different alien worlds to retrieve ancient artifacts that hold the key to saving Earth from an impending disaster.</p>
    <p>Each level represents a different planet with unique environments, enemies, and challenges. Your mission is to collect all the artifacts and save humanity!</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView',
});
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
}
h1 {
  margin-bottom: 20px;
}
p {
  margin-bottom: 10px;
  max-width: 600px;
}
</style>
