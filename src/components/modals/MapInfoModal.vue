<template>
  <div class="map-info-modal" v-if="show">
    <div class="modal-top">
      <div class="modal-title-wrap">
        <span class="modal-title">{{ label }}</span>
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
      <button class="modal-close" @click="$emit('close')" aria-label="Fermer">×</button>
    </div>

    <div class="modal-section" v-if="type === 'monster' && monster">
      <div class="section-title">Stats:</div>
      <div class="stat-line"><span class="stat-ico">❤️</span> {{ monster.hp }} HP</div>
      <template v-for="atk in monsterAttacks" :key="atk.label">
        <div class="stat-line" v-if="atk.value">
          <span class="stat-ico">{{ atk.icon }}</span>
          {{ atk.value }} {{ atk.label }}
        </div>
      </template>
      <div class="section-title">Drops:</div>
      <ul class="drops-list">
        <li v-for="drop in monster.drops" :key="drop.code">
          <img :src="dropImg(drop.code)" :alt="drop.code" class="drop-icon" />
          <span class="drop-label">{{ readableDrop(drop.code) }}</span>
          <span class="drop-rate">{{ percent(100 / drop.rate, 2) }}% ({{ drop.min_quantity }})</span>
        </li>
      </ul>
    </div>

    <div class="modal-section" v-else-if="type === 'resource' && resource">
      <div class="section-title">Skill:</div>
      <div class="skill-line">
        <img :src="skillIcon(resource.skill)" class="skill-ico" />
        {{ capitalize(resource.skill) }} (Level {{ resource.level }})
      </div>
      <div v-if="resource.xp_per_action" class="stat-line">
        <span class="stat-ico">⭐</span> {{ resource.xp_per_action }} xp
      </div>
      <div v-if="resource.respawn_time" class="stat-line">
        <span class="stat-ico">⏱️</span> Respawn: {{ resource.respawn_time }}s
      </div>
      <div class="section-title">Drops:</div>
      <ul class="drops-list">
        <li v-for="drop in resource.drops" :key="drop.code">
          <img :src="dropImg(drop.code)" :alt="drop.code" class="drop-icon" />
          <span class="drop-label">{{ readableDrop(drop.code) }}</span>
          <span class="drop-rate">{{ percent(100 / drop.rate, 2) }}% ({{ drop.min_quantity }})</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show: boolean
  label: string
  type: string
  level: number | null
  monster: any
  resource: any
}>()

defineEmits(['close'])

const monsterAttacks = computed(() => [
  { icon: '🔥', label: 'Fire attack', value: props.monster?.attack_fire },
  { icon: '🌱', label: 'Earth attack', value: props.monster?.attack_earth },
  { icon: '💧', label: 'Water attack', value: props.monster?.attack_water },
  { icon: '💨', label: 'Air attack', value: props.monster?.attack_air }
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

.map-info-modal {
  background: #21381B;
  color: #fffac0;
  border: 2.5px solid #43633e;
  border-radius: 13px;
  min-width: 260px;
  max-width: 325px;
  max-height: 520px;
  box-shadow: 0 8px 32px #000c;
  padding: 23px 33px 22px 21px;
  position: absolute;
  left: 0;
  top: 38px;
  animation: fadeIn .16s;
  z-index: 1200;
  font-family: inherit;
  display: flex;
  flex-direction: column;
}

.modal-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 13px;
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
  color: #ffe792;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 0 #344634;
}

.modal-level {
  font-size: 14px;
  color: #9eff7b;
  font-weight: bold;
  margin-left: 1px;
}

.modal-img {
  width: 54px;
  height: 54px;
  object-fit: contain;
  margin-top: 0px;
  margin-right: 50px;
  image-rendering: pixelated;
}

.modal-close {
  position: absolute;
  right: -18px;
  top: -13px;
  font-size: 23px;
  color: #ffe792;
  background: #284a31;
  border: 2px solid #43633e;
  border-radius: 50%;
  width: 29px;
  height: 29px;
  cursor: pointer;
  line-height: 26px;
  z-index: 5;
  transition: background 0.14s, color 0.14s;
}

.modal-close:hover {
  background: #3cb162;
  color: #ffe792;
}

.modal-section {
  margin-top: 8px;
}

.section-title {
 color: #fffac0;
  font-weight: 900;
  font-size: 1.01em;
  margin-right: 3px;
  padding-bottom: 9px;
}

.stat-line {
 font-size: 16px;
  color: #ffe792;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
  font-weight: 900;
   letter-spacing: 0.04em;
}

.stat-ico {
  font-size: 18px;
  margin-right: 7px;
  vertical-align: middle;
}
.skill-line {
font-size: 16px;
  color: #ffe792;
  font-weight: bold;
  letter-spacing: .02em;
  width: fit-content;
  margin-bottom: 2px;
  font-weight: 900;
}

.skill-ico {
  width: 42px;
  height: 42px;
  margin-right: 4px;
  vertical-align: middle;
  
}

.drops-list {
  margin: 1px 0 0 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: #ffe792;
  display: flex;
  flex-direction: column;
}

.drops-list li {
 display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 0;
  font-size: 15px;
  border-radius: 7px;
  position: relative;
  padding-left: 17px;
}
.drops-list li::before {
  content: '';
  display: inline-block;
  width: 7px; height: 7px;
  background: #ffe792;
  border-radius: 50%;
  position: absolute;
  left: 0; top: 13px;
  opacity: 0.87;
}
.drop-icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
  vertical-align: middle;
  border-radius: 4px;
  background: #293e2d;
  border: 2px solid #2a4534;
  box-shadow: 1px 1px 0 #212, 0 2px 6px #0005;
}

.drop-label {
  color: #ffe792;
  font-weight: bold;
  margin-right: 7px;
}

.drop-rate {
  color: #9eff7b;
  font-size: 12px;
  margin-left: 3px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
