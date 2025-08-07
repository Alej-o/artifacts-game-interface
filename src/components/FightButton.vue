<template>
  <button @click="fight" :disabled="loading || cooldown > 0" class="fight-button">
    <span v-if="loading">Fighting...</span>
    <span v-else-if="cooldown > 0">⏳ {{ cooldown }}s</span>
    <span v-else>⚔️ Fight</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayer } from '../stores/usePlayer'
import { useMap } from '../stores/useMap'

const { player, updatePlayer } = usePlayer()
const { fetchCurrentMap } = useMap()

const loading = ref(false)
const cooldown = ref(0)
let intervalId: number | null = null

const currentPlayer = computed(() => player ?? null)

async function fight() {
  if (!currentPlayer.value) return
  loading.value = true

  try {
    const res = await fetch(`https://api.artifactsmmo.com/my/${currentPlayer.value.name}/action/fight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_ARTIFACT_TOKEN}`,
      },
    })

    const data = await res.json()
    const updated = data.data

    updatePlayer(updated.character)

    fetchCurrentMap(updated.character.x, updated.character.y)

    if (updated.fight?.drops?.length) {
      updated.fight.drops.forEach((drop: any) => {
        console.log('Drop:', drop.code, 'x', drop.quantity)
      })
    }

    if (updated.fight?.logs?.length) {
      updated.fight.logs.forEach((log: string) => {
        console.log(log)
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
    console.error('[Erreur fight]', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fight-button {
  position: absolute;
  font-size: 14px;
  padding: 4px 8px;
  background-color: #b22222ee;
   color: #ffe792;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
