<template>
  <nav
    class="player-actions"
    aria-label="Player actions"
  >
  
    <button
      type="button"
      @click="showStats = true"
      aria-label="Open stats (T)"
      aria-keyshortcuts="T"
      aria-haspopup="dialog"
      :aria-expanded="showStats"
      aria-controls="stats-modal"
      title="Stats (T)"
    >
      <img
        src="https://www.artifactsmmo.com/images/items/life_crystal.png"
        alt=""
        aria-hidden="true"
      />
    </button>

   
    <button
      type="button"
      @click="showInventory = true"
      aria-label="Open inventory (I)"
      aria-keyshortcuts="I"
      aria-haspopup="dialog"
      :aria-expanded="showInventory"
      aria-controls="inventory-modal"
      title="Inventory (I)"
    >
      <img
        src="https://www.artifactsmmo.com/images/items/backpack.png"
        alt=""
        aria-hidden="true"
      />
    </button>

   
    <button
      type="button"
      @click="showSkills = true"
      aria-label="Open skills (M)"
      aria-keyshortcuts="M"
      aria-haspopup="dialog"
      :aria-expanded="showSkills"
      aria-controls="skills-modal"
      title="Skills (M)"
    >
      <img
        src="https://www.artifactsmmo.com/images/items/spruce_fishing_rod.png"
        alt=""
        aria-hidden="true"
      />
    </button>


    <button
      type="button"
      @click="showAchievements = true"
      aria-label="Open achievements (A)"
      aria-keyshortcuts="A"
      aria-haspopup="dialog"
      :aria-expanded="showAchievements"
      aria-controls="achievements-modal"
      title="Achievements (A)"
    >
      <img
        src="https://www.artifactsmmo.com/images/items/lich_crown.png"
        alt=""
        aria-hidden="true"
      />
    </button>


    <InventoryModal
      v-if="showInventory"
      id="inventory-modal"
      @close="showInventory = false"
    />
    <StatsModal
      v-if="showStats"
      id="stats-modal"
      @close="showStats = false"
    />
    <SkillsModal
      v-if="showSkills"
      id="skills-modal"
      @close="showSkills = false"
    />
    <AchievementsModal
      v-if="showAchievements && player"
      id="achievements-modal"
      :account="player.account"
      @close="showAchievements = false"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import StatsModal from "../components/modals/StatsModal.vue"
import InventoryModal from "../components/modals/InventoryModal.vue"
import SkillsModal from "../components/modals/SkillsModal.vue"
import AchievementsModal from "../components/modals/AchievementsModal.vue"
import { usePlayer } from '../stores/usePlayer'

const { player } = usePlayer()

const showInventory = ref(false)
const showStats = ref(false)
const showSkills = ref(false)
const showAchievements = ref(false)

function handleKeyDown(e: KeyboardEvent) {
  
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
  const key = e.key.toLowerCase()
  if (key === 'i') showInventory.value = true
  if (key === 't') showStats.value = true
  if (key === 'm') showSkills.value = true
  if (key === 'a') showAchievements.value = true
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.player-actions {
  position: fixed;
  bottom: 25px;
  left: 450px;
  display: flex;
  flex-direction: row;
  gap: 13px;
  z-index: 1300;
  user-select: none;
}

button {
  background: #21381B;
  border: 1.5px solid #435b47;
  border-radius: 10px;
  padding: 6px;
  cursor: pointer;
  width: 52px;
  height: 52px;
  box-shadow: 0 2px 10px #0004;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.18s;
  outline: none;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
}

button:hover,
button:focus {
  border-color: #8bd3a6;
  background: linear-gradient(120deg, #395942 88%, #b9eee0 100%);
  box-shadow: 0 4px 18px #b9eee029, 0 2px 10px #0004;
}

button img {
  width: 34px;
  height: 34px;
  image-rendering: pixelated;
  border: none;
  pointer-events: none;
}

button:active {
  background: #b9eee0;
  border-color: #a6d6c2;
}
</style>
