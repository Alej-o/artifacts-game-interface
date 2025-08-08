<template>
  <main>
    <div v-if="!store.player"></div>
    <MapView v-if="store.player" />
    <PlayerOverlay v-if="store.player" />
  </main>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
import { usePlayer } from './stores/usePlayer'
import MapView from './components/MapView.vue'
import PlayerOverlay from './components/PlayerOverlay.vue'

const store = usePlayer()

onMounted(() => {
  store.fetchPlayer()
})
</script>


