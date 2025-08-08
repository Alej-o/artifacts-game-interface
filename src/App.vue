<template>
  <main>
    <MapView v-if="store.player" @ready="mapReady = true" />
    <PlayerOverlay v-if="store.player && mapReady" />
    <BootScreen v-if="store.player && !mapReady" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlayer } from './stores/usePlayer'
import MapView from './components/MapView.vue'
import PlayerOverlay from './components/PlayerOverlay.vue'

const store = usePlayer()
const mapReady = ref(false)

onMounted(async () => {
  await store.fetchPlayer()
})
</script>

<style scoped>
main { width: 100vw; height: 100vh; }
</style>
