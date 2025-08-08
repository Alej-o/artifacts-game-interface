<template>
  <button
    @click="fight"
    :disabled="loading || !cd.canAct"
    class="fight-button"
  >
    <span v-if="loading">Fighting...</span>
    <span v-else-if="!cd.canAct">⏳ {{ cd.remaining }}s</span>
    <span v-else>⚔️ Fight</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayer } from '../stores/usePlayer'
import { useMap } from '../stores/useMap'
import { useCooldown } from '../stores/useCooldown' 

const cd = useCooldown()
const loading = ref(false)

const { player, updatePlayer } = usePlayer()
const { fetchCurrentMap } = useMap()
const currentPlayer = computed(() => player ?? null)

async function fight() {
  if (!currentPlayer.value || loading.value || !cd.canAct) return
  loading.value = true

  try {
    const res = await cd.guard(async () => {
      const r = await fetch(
        `https://api.artifactsmmo.com/my/${currentPlayer.value!.name}/action/fight`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_ARTIFACT_TOKEN}`,
          },
        }
      )
      return r.json()
    })

    if (!res) return

    const updated = (res as any)?.data
    if (updated?.character) {
      updatePlayer(updated.character)
      fetchCurrentMap(updated.character.x, updated.character.y)
    }

    if (updated?.fight?.drops?.length) {
      updated.fight.drops.forEach((drop: any) => {
        console.log('Drop:', drop.code, 'x', drop.quantity)
      })
    }

    if (updated?.fight?.logs?.length) {
      updated.fight.logs.forEach((log: string) => {
        console.log(log)
      })
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
