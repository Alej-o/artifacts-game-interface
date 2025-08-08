<template>
  <button
  @click="gather"
  :disabled="loading || !cd.canAct || !resourceDetails || !hasRequiredSkill || !meetsAllConditions"
  :aria-busy="loading ? 'true' : 'false'"
  :aria-disabled="!cd.canAct"
  class="gather-button"
>
    <span v-if="loading">Gathering...</span>
    <span v-else-if="!cd.canAct">⏳ {{ cd.remaining }}s</span>
    <span v-else>⚒️ Gathering</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayer } from '../stores/usePlayer'
import { useMap } from '../stores/useMap'
import { useCooldown } from '../stores/useCooldown'   

type Drop = { code: string; rate: number; min_quantity: number }
type Cond = { code: string; value: number }
type ResourceDetails = {
  type: 'resource'
  code: string
  skill: string
  level: number
  conditions?: Cond[]
  xp_per_action?: number
  respawn_time?: number
  drops?: Drop[]
}

const cd = useCooldown()               
const loading = ref(false)

const playerStore = usePlayer()
const mapStore = useMap()
const { player } = storeToRefs(playerStore)
const { currentMap } = storeToRefs(mapStore)
const currentPlayer = computed(() => player.value ?? null)

const mapResource = computed(() => {
  const c = currentMap.value?.content
  return c && c.type === 'resource' && typeof c.code === 'string' ? c : null
})

const resourceDetails = ref<ResourceDetails | null>(null)

async function loadResourceDetails() {
  resourceDetails.value = null
  if (!mapResource.value) return
  try {
    const res = await fetch(`https://api.artifactsmmo.com/resources/${mapResource.value.code}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_ARTIFACT_TOKEN}`,
      },
    })
    const json = await res.json()
    resourceDetails.value = json?.data ?? null
  } catch (e) {
    console.error('[loadResourceDetails]', e)
    resourceDetails.value = null
  }
}
watch(mapResource, loadResourceDetails, { immediate: true })

const hasRequiredSkill = computed(() => {
  if (!resourceDetails.value || !currentPlayer.value) return false
  const key = `${resourceDetails.value.skill.toLowerCase()}_level`
  const required = resourceDetails.value.level ?? 1
  const playerLvl = (currentPlayer.value as any)[key] ?? -1
  return playerLvl >= required
})

function checkCondition(cond: Cond): boolean {
  if (!currentPlayer.value) return false
  if (cond.code === 'level') return currentPlayer.value.level >= cond.value
  if (cond.code.endsWith('_level')) {
    const key = cond.code.toLowerCase()
    return ((currentPlayer.value as any)[key] ?? -1) >= cond.value
  }
  return true
}
const meetsAllConditions = computed(() => {
  const conds = resourceDetails.value?.conditions
  if (!conds?.length) return true
  return conds.every(checkCondition)
})

async function gather() {
  if (!currentPlayer.value || loading.value || !cd.canAct) return
  loading.value = true
  try {
    const res = await cd.guard(() =>
  fetch(`https://api.artifactsmmo.com/my/${currentPlayer.value!.name}/action/gathering`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_ARTIFACT_TOKEN}`,
    },
  }).then(r => r.json())
)

    if (!res) return 

    const updated = (res as any)?.data
    if (updated?.character) {
      playerStore.updatePlayer(updated.character)
      mapStore.fetchCurrentMap(updated.character.x, updated.character.y)
    }
  
  } catch (err) {
    console.error('[Erreur gather]', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (mapResource.value && !resourceDetails.value) loadResourceDetails()
})
</script>

<style scoped>
.gather-button {
  position: absolute;
  font-size: 14px;
  padding: 4px 8px;
  background: #246b35;
  color: #ffe792;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.gather-button:disabled {
  background: #2a4534;
  color: #b8b89e;
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
