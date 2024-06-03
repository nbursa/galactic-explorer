<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/game">Game</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
header {
  position: absolute;
  top: 2rem;
  left: 2rem;
  right: 2rem;
  z-index: 10;
  border-radius: 8px;
}
nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  background-color: #333;
  color: white;
}
router-link {
  color: white;
  text-decoration: none;
}
router-link:hover {
  text-decoration: underline;
}
</style>
