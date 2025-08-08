
<template>
  <button
    class="rest-btn"
    @click="rest"
    :disabled="isResting || hpIsFull || !cd.canAct"
    :title="hpIsFull ? 'HP Full' : !cd.canAct ? 'On cooldown' : isResting ? 'Resting...' : 'Rest by the campfire'"
  >
    <FlameKindling :size="22" :class="{ resting: isResting }" />
    
    <div v-if="!cd.canAct" class="btn-progress">
      <div class="btn-fill" :style="{ width: (cd.progress * 100) + '%' }"></div>
    </div>
  </button>
</template>


<script setup lang="ts">
import { FlameKindling } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { usePlayer } from '../stores/usePlayer'
import { storeToRefs } from 'pinia'
import { useCooldown } from '../stores/useCooldown'

const cd = useCooldown()
const playerStore = usePlayer()
const { player } = storeToRefs(playerStore)
const { updatePlayer, fetchPlayer } = playerStore

const isResting = ref(false)

const hpIsFull = computed(() =>
  !!player.value && player.value.hp === player.value.max_hp
)

async function rest() {
  if (isResting.value || hpIsFull.value || !player.value || !cd.canAct) return
  isResting.value = true
  try {
    
    const res = await fetch(
      `https://api.artifactsmmo.com/my/${player.value!.name}/action/rest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_ARTIFACT_TOKEN}`,
        },
      }
    )

    const json = await res.json()

    if (!res.ok) {
      console.error('[rest] API error', json)
      return
    }

    const cdData = json?.data?.cooldown
    if (cdData) {
      const s = cdData.total_seconds && cdData.total_seconds > 0
        ? cdData.total_seconds
        : (cdData.remaining_seconds ?? 0)
      cd.startCooldown(s, cdData.expiration)
    }

 
    if (json?.data?.character) {
      updatePlayer(json.data.character)
    } else {
    
      await fetchPlayer()
    }
  } catch (e) {
    console.error('[rest] fetch failed', e)
  } finally {
    isResting.value = false
  }
}
</script>


<style scoped>
.rest-btn {
  position: relative;
  background: #223515;
  color: #ffe792;
  border-radius: 6px;
  width: 40px; height: 40px;
  display: inline-flex; align-items: center; justify-content: center;
  transition: background .16s, border-color .16s, transform .16s;
  cursor: pointer;
  box-shadow: 0 2px 10px #0003;
  border: 2px solid #355f2b;
  overflow: hidden;
}
.rest-btn:hover:not(:disabled) {
  transform: scale(1.05);
  background: #2f4a1d;
}
.rest-btn:disabled {
  background: #242826;
  opacity: .7;
  cursor: not-allowed;
}

/* .resting {
  animation: flamePulse 0.8s infinite alternate;
}
@keyframes flamePulse {
  from { transform: scale(1); opacity: 1; }
  to   { transform: scale(1.15); opacity: .85; }
} */

.btn-progress {
  position: absolute; left: 4px; right: 4px; bottom: 3px;
  height: 3px; background: #1b2d17; border-radius: 999px;
}
.btn-fill {
  height: 100%; width: 0%;
  background: linear-gradient(90deg, #7be36f, #d9ff7a);
  border-radius: 999px;
  transition: width .2s linear;
}
</style>
