<template>
  <div class="coordination" v-if="currentMap">
    <p>{{ currentMap.name }}</p>
    <p>({{ currentMap.x }}, {{ currentMap.y }})</p>
    <p>
      <span v-if="currentMap.content?.code">{{ currentMap.content.code }}</span>
      <span v-else></span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useMap } from '../stores/useMap'

const { currentMap } = useMap()
</script>

<style scoped>
.coordination {
  position: fixed;
  top: 20px;
  left: 25px;
  font-weight: bold;
  font-size: 20px;
  color: #fcfcfc;
  font-family: sans-serif;
  z-index: 999;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 5px;
}
</style>
