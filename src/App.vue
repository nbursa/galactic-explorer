<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  border-radius: 8px;
}
nav {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  background-color: transparent;
}
nav a {
  padding: 10px;
  color: white;
  font-weight: 300;
  text-decoration: none;
}
router-link {
  color: white;
  text-decoration: none;
}
router-link:hover {
  text-decoration: underline;
}
</style>
