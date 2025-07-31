<template>
  <button @click="gather" :disabled="loading || cooldown > 0" class="gather-button">
    <span v-if="loading">Gathering...</span>
    <span v-else-if="cooldown > 0">⏳ {{ cooldown }}s</span>
    <span v-else>⚒️ Gather</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayer } from '../stores/usePlayer'
import { useMap } from '../stores/useMap'

const loading = ref(false)
const cooldown = ref(0)
let intervalId: number | null = null

const { player, updatePlayer } = usePlayer()
const { fetchCurrentMap } = useMap()
const currentPlayer = computed(() => player ?? null)

async function gather() {
  if (!currentPlayer.value) return
  loading.value = true

  try {
    const res = await fetch(`https://api.artifactsmmo.com/my/${currentPlayer.value.name}/action/gathering`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_ARTIFACT_TOKEN}`,
      },
    })

    const data = await res.json()
    const updated = data.data

    
    if (updated.character) {
      updatePlayer(updated.character)
      fetchCurrentMap(updated.character.x, updated.character.y)
    }

    
    if (updated.details?.items) {
      updated.details.items.forEach((item: { code: string }) => {
        console.log('You found:', item.code)
      })
    }

    const duration = updated.cooldown?.remaining_seconds ?? 0
    if (duration > 0) {
      cooldown.value = duration
      if (intervalId) clearInterval(intervalId)
      intervalId = setInterval(() => {
        cooldown.value--
        if (cooldown.value <= 0 && intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
      }, 1000)
    }

  } catch (err) {
    console.error('[Erreur gather]', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.gather-button {
  position: absolute;
  font-size: 14px;
  padding: 4px 8px;
  background-color: #3a3f5ede;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
