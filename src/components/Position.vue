<template>
  <div class="position" v-if="map">
    <div class="coords-row">
      <span class="name-main">{{ map.name }}</span>
      <span class="coords">({{ map.x }}, {{ map.y }})</span>
    </div>
    <div class="name-row">
      <span
        v-if="isInfoType"
        class="content-name-btn"
        @click="showInfo = true"
        tabindex="0"
        @keydown.enter="showInfo = true"
        @keydown.space.prevent="showInfo = true"
        role="button"
        aria-label="Show location info"
      >
        {{ displayLabel }}
        <Info class="info-inline" />
      </span>
      <span
        v-else
        class="content-name-static"
      >
        {{ displayLabel }}
      </span>
    </div>

    <MapInfoModal
      v-if="showInfo && isInfoType"
      :show="showInfo"
      :label="displayLabel"
      :type="type"
      :level="level"
      :monster="monster"
      :resource="resource"
      @close="showInfo = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useMap } from '../stores/useMap'
import { computed, ref, watch } from 'vue'
import { Info } from 'lucide-vue-next'
import MapInfoModal from '../components/modals/MapInfoModal.vue' 

const CATEGORY_LABELS: Record<string, string> = {
  workshop: "Workshop",
  bank: "Bank",
  grand_exchange: "Grand Exchange",
  task_master: "Task Master",
  npc: "NPC"
}

const store = useMap()
const map = computed(() => store.currentMap)
const showInfo = ref(false)

const type = computed(() => map.value?.content?.type ?? '')
const code = computed(() => map.value?.content?.code ?? '')

const level = ref<number | null>(null)
const resource = ref<any>(null)
const monster = ref<any>(null)

function readableLabel(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}
const contentName = computed(() =>
  type.value === 'monster' ? monster.value?.name :
  type.value === 'resource' ? resource.value?.name :
  type.value === 'workshop' || type.value === 'bank' || type.value === 'grand_exchange' || type.value === 'task_master' || type.value === 'npc'
    ? (code.value ? readableLabel(code.value) : CATEGORY_LABELS[type.value])
    : null
)
const displayLabel = computed(() => contentName.value || CATEGORY_LABELS[type.value] || null)
const isInfoType = computed(() => type.value === 'monster' || type.value === 'resource')

watch([type, code], async ([t, c]) => {
  level.value = null
  resource.value = null
  monster.value = null

  if (!t || !c) return
  if (t === 'resource') {
    const res = await fetch(`https://api.artifactsmmo.com/resources/${c}`)
    const json = await res.json()
    resource.value = json.data
    level.value = json.data.level
  }
  if (t === 'monster') {
    const res = await fetch(`https://api.artifactsmmo.com/monsters/${c}`)
    const json = await res.json()
    monster.value = json.data
    level.value = json.data.level
  }
})
</script>

<style scoped>

.position {
  position: fixed;
  top: 22px;
  left: 24px;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
  background: #21381B;
  color: #ffe792;
  border-radius: 13px;
  border: 2.5px solid #43633e;
  box-shadow: 0 2px 14px #0008;
  padding: 14px 0 13px 19px;
  min-width: 270px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 2px;
  user-select: none;
}

.coords-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 1px;
}
.name-main {
  font-size: 19px;
  font-weight: bold;
  color: #ffe792;
  text-shadow: 1px 1px 0 #344634;
  text-transform: uppercase;
}
.coords {
  opacity: .92;
  font-size: 18px;
  color: #fffac0;
  font-weight: bold;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
}
.content-name-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #ffe792;
  font-size: 18px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: color 0.16s, background 0.14s;
  outline: none;
}
.content-name-btn:hover,
.content-name-btn:focus {
  color: #b7f183;
}
.info-inline {
  width: 16px;
  height: 16px;
  margin-left: 2px;
  color: inherit;
  vertical-align: middle;
  pointer-events: none;
}
.content-name-static {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #b7f183;
  font-size: 18px;
  font-weight: bold;
  border-radius: 5px;
  outline: none;
}
</style>
