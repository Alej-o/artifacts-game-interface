<!-- components/PositionInfo.vue -->
<template>
  <div class="position" v-if="map">
    <p>{{ map.name }}</p>
    <p>{{ map.x }}, {{ map.y }}</p>
    <p v-if="map.content?.code">{{ map.content.code }}</p>
  </div>
</template>

<script setup lang="ts">
import { useMap } from '../stores/useMap'
import { computed } from 'vue'

const store = useMap()
const map = computed(() => store.currentMap)
</script>

<style scoped>
.position {
  position: fixed;
  top: 20px;
  left: 25px;
  font-weight: bold;
  font-size: 20px;
  color: #faf5f2;
  font-family: sans-serif;
  z-index: 999;
  display: flex;
  gap: 15px;
}
</style>
