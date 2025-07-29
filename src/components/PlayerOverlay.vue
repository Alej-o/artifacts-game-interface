<template>
  <div class="coordination" v-if="map">
    <p>{{ map.name }}</p>
    <p>({{ map.x }}, {{ map.y }})</p>
    <p>
      <span v-if="map.content?.code">{{ map.content.code }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMap } from '../stores/useMap'


const store = useMap()


const map = computed(() => store.currentMap)
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
