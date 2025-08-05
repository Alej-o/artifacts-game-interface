<template>
  <div class="position" v-if="map">
    <div class="coords-row">
      <span class="name-main">{{ map.name }}</span>
      <span class="coords">x:{{ map.x }} y:{{ map.y }}</span>
    </div>
    <div class="name-row" v-if="contentName">
      <span
        class="content-name-btn"
        @click="showInfo = true"
        tabindex="0"
        @keydown.enter="showInfo = true"
        @keydown.space.prevent="showInfo = true"
        role="button"
        aria-label="Show location info"
      >
        {{ contentName }}
        <Info class="info-inline" />
      </span>
    </div>

    
    <div v-if="showInfo" class="map-info-modal">
      <div class="modal-top">
        <div class="modal-title-wrap">
          <span class="modal-title">{{ contentName?.toUpperCase() }}</span>
          <span v-if="level" class="modal-level">Level {{ level }}</span>
        </div>
        <img
          v-if="type === 'monster' && monster?.code"
          :src="`https://www.artifactsmmo.com/images/monsters/${monster.code}.png`"
          :alt="monster.name"
          class="modal-img"
        />
        <img
          v-else-if="type === 'resource' && resource?.code"
          :src="`https://www.artifactsmmo.com/images/resources/${resource.code}.png`"
          :alt="resource.name"
          class="modal-img"
        />
        <button class="modal-close" @click="showInfo = false" aria-label="Fermer">×</button>
      </div>

      <div class="modal-section" v-if="type === 'monster' && monster">
        <div class="section-title">Stats</div>
        <div class="stat-line"><span class="stat-ico">❤️</span> {{ monster.hp }} HP</div>
        <template v-for="atk in monsterAttacks" :key="atk.label">
          <div class="stat-line" v-if="atk.value">
            <span class="stat-ico">{{ atk.icon }}</span>
            {{ atk.value }} {{ atk.label }}
          </div>
        </template>
        <div class="section-title">Drops</div>
        <ul class="drops-list">
          <li v-for="drop in monster.drops" :key="drop.code">
            <img :src="dropImg(drop.code)" :alt="drop.code" class="drop-icon" />
            <span class="drop-label">{{ readableDrop(drop.code) }}</span>
            <span class="drop-rate">{{ percent(100 / drop.rate, 2) }}% ({{ drop.min_quantity }})</span>
          </li>
        </ul>
      </div>

      <div class="modal-section" v-else-if="type === 'resource' && resource">
        <div class="section-title">Skill</div>
        <div class="stat-line">
          <img :src="skillIcon(resource.skill)" class="stat-ico" />
          {{ capitalize(resource.skill) }} (Level {{ resource.level }})
        </div>
        <div v-if="resource.xp_per_action" class="stat-line">
          <span class="stat-ico">⭐</span> {{ resource.xp_per_action }} xp
        </div>
        <div v-if="resource.respawn_time" class="stat-line">
          <span class="stat-ico">⏱️</span> Respawn: {{ resource.respawn_time }}s
        </div>
        <div class="section-title">Drops</div>
        <ul class="drops-list">
          <li v-for="drop in resource.drops" :key="drop.code">
            <img :src="dropImg(drop.code)" :alt="drop.code" class="drop-icon" />
            <span class="drop-label">{{ readableDrop(drop.code) }}</span>
            <span class="drop-rate">{{ percent(100 / drop.rate, 2) }}% ({{ drop.min_quantity }})</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useMap } from '../stores/useMap'
import { computed, ref, watch } from 'vue'
import { Info } from 'lucide-vue-next';
const store = useMap()
const map = computed(() => store.currentMap)
const showInfo = ref(false)

const type = computed(() => map.value?.content?.type)
const code = computed(() => map.value?.content?.code)
const contentName = computed(() =>
  type.value === 'monster' ? monster.value?.name :
  type.value === 'resource' ? resource.value?.name :
  ''
)

const level = ref<number | null>(null)
const resource = ref<any>(null)
const monster = ref<any>(null)

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

const monsterAttacks = computed(() => [
  { icon: '🔥', label: 'Fire attack', value: monster.value?.attack_fire },
  { icon: '🌱', label: 'Earth attack', value: monster.value?.attack_earth },
  { icon: '💧', label: 'Water attack', value: monster.value?.attack_water },
  { icon: '💨', label: 'Air attack', value: monster.value?.attack_air }
])


function percent(val: number, digits: number = 1): string {
  return (+val).toFixed(digits)
}

function readableDrop(code: string): string {
  if (!code) return ''
  return code
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}



function dropImg(code: string): string {
  if (!code) return ''
  return `https://www.artifactsmmo.com/images/items/${code}.png`
}


function skillIcon(skill: string): string {
  const icons: Record<string, string> = {
   mining:        'https://www.artifactsmmo.com/images/items/iron_pickaxe.png',
  woodcutting:   'https://www.artifactsmmo.com/images/items/iron_axe.png',
  fishing:       'https://www.artifactsmmo.com/images/items/spruce_fishing_rod.png',
  weaponcrafting:'https://www.artifactsmmo.com/images/items/iron_sword.png',
  gearcrafting:  'https://www.artifactsmmo.com/images/items/iron_armor.png',
  jewelrycrafting:'https://www.artifactsmmo.com/images/items/fire_ring.png',
  cooking:       'https://www.artifactsmmo.com/images/items/raw_beef.png',
  alchemy:       'https://www.artifactsmmo.com/images/items/health_potion.png',
  }
  return icons[skill] || ''
}
function capitalize(str?: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
</script>

<style scoped>

.position {
  position: fixed;
  top: 20px;
  left: 25px;
  font-weight: bold;
  font-size: 18px;
  color: var(--color-text-main);
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--color-bg-main);
  border-radius: 12px;
  padding: 13px 18px 11px 17px;
  border: 2.5px solid var(--color-border);
  min-width: 252px;
  user-select: none;
}

.coords-row {
  display: flex;
  align-items: center;
  gap: 19px;
}
.name-main {
  font-size: 19px;
  font-weight: bold;
}
.coords {
  opacity: 0.89;
  font-size: 18px;
  color: var(--color-text-main);
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
  color: var(--color-text-reward);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.16s;
  outline: none;
  border-radius: 5px;
  padding: 0 4px;
}
.content-name-btn:hover,
.content-name-btn:focus {
  color: var(--color-success);
}
.info-inline {
  width: 17px;
  height: 17px;
  margin-left: 1px;
  color: inherit;
  vertical-align: middle;
  transition: color 0.16s;
  pointer-events: none;
}
.map-level {
  font-size: 15px;
  color: var(--color-success);
  font-weight: bold;
  margin-left: 4px;
}


.map-info-modal {
  background: var(--color-bg-card); 
  color: var(--color-text-secondary);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  min-width: 310px;
  min-height: 180px;
  box-shadow: 0 8px 32px #000c;
  padding: 24px 34px 24px 24px;
  position: absolute;
  left: 0; top: 38px;
  animation: fadeIn .16s;
  z-index: 1200;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 12px;
  position: relative;
}
.modal-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.modal-title {
  font-size: 22px;
  font-weight: bold;
  color: var(--color-text-secondary);
  letter-spacing: .5px;
}
.modal-level {
  font-size: 15px;
  color: var(--color-success);
  font-weight: bold;
  margin-left: 1px;
}
.modal-img {
  width: 47px;
  height: 47px;
  object-fit: contain;
  margin-top: 0px;
  margin-right: 70px;
  image-rendering: pixelated;

}
.modal-close {
  position: absolute;
  right: -20px;
  top: -13px;
  font-size: 23px;
  color: var(--color-text-main);
  background: var(--color-modal-close-bg);
  border: 2px solid var(--color-modal-close-border);
  border-radius: 50%;
  width: 30px; height: 30px;
  cursor: pointer;
  line-height: 28px;
  font-family: inherit;
  z-index: 5;
  transition: background .14s, color .14s;
}
.modal-close:hover {
  background: var(--color-modal-close-hover-bg);
  color: var(--color-text-reward);
}

.modal-section {
  margin-top: 8px;
}
.section-title {
  font-size: 16px;
  color: var(--color-text-reward);
  font-weight: bold;
  margin: 13px 0 2px 0;
}
.stat-line {
  font-size: 15px;
  color: var(--color-text-main);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}
.stat-ico {
  font-size: 19px;
  margin-right: 8px;
  vertical-align: middle;
}
.drops-list {
  margin: 1px, 0 0 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: var(--color-tab-active);
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.drop-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 8px;
  image-rendering: pixelated;
  border-radius: 2px;
  background: #292e28; 
}
.drop-label {
  color: var(--color-tab-active); 
  font-weight: bold;
  margin-right: 7px;
}
.drop-rate {
  color: var(--color-success);
  font-size: 12px;
  margin-left: 3px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}


</style>
