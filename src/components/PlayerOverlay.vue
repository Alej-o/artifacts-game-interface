<template>
  <main role="main" aria-label="Game HUD">
    <Position />
    <PlayerStatus />
    <PlayerActions />
  </main>
</template>

<script setup lang="ts">
import Position from './Position.vue'
import PlayerStatus from './PlayerStatus.vue'
import PlayerActions from './PlayerActions.vue'
</script>
