<template>
  <main>
    <div v-if="!store.player">Chargement du joueur...</div>
    <MapView v-else />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePlayer } from './stores/usePlayer'
import MapView from './components/MapView.vue'

const store = usePlayer()

onMounted(() => {
  store.fetchPlayer()
})
</script>
