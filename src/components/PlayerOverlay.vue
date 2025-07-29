<template>
  <div class="coordination" v-if="currentMap">
    <p> {{ currentMap.name }}</p>
    <p>({{ currentMap.x }}, {{ currentMap.y }})</p>
      <span v-if="currentMap.content?.code">{{ currentMap.content.code }}</span>
      <span v-else></span>
  </div>
</template>

<script setup lang="ts">
import { usePlayer } from '../stores/usePlayer'

const { currentMapName: currentMap } = usePlayer()
</script>

<style scoped>
.coordination {
  position: fixed;
  top: 20px;
  left: 25px;
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
  font-family: sans-serif;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 5px;

}
</style>
