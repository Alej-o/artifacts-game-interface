<template>
  <div class="player-actions">
    <button @click="showStats = true">
      <img src="https://www.artifactsmmo.com/images/items/life_crystal.png" alt="Stats" />
    </button>
    <button @click="showEquipment = true">
      <img src="https://www.artifactsmmo.com/images/items/leather_armor.png" alt="Equipment" />
    </button>
    <button @click="showInventory = true">
      <img src="https://www.artifactsmmo.com/images/items/backpack.png" alt="Inventory" />
    </button>
    <button @click="showSkills = true">
      <img src="https://www.artifactsmmo.com/images/items/spruce_fishing_rod.png" alt="Skills" />
    </button>
    <button @click="showAchievements = true">
      <img src="https://www.artifactsmmo.com/images/items/lich_crown.png" alt="Achievements" />
    </button>

  
    <InventoryModal v-if="showInventory" @close="showInventory = false" />
    <EquipmentModal v-if="showEquipment" @close="showEquipment = false" />
    <StatsModal v-if="showStats" @close="showStats = false" />
    <SkillsModal v-if="showSkills" @close="showSkills = false" />
    <AchievementsModal v-if="showAchievements" @close="showAchievements = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import StatsModal from "../components/modals/StatsModal.vue"
import EquipmentModal from "../components/modals/EquipmentModal.vue"


const showInventory = ref(false)
const showEquipment = ref(false)
const showStats = ref(false)
const showSkills = ref(false)
const showAchievements = ref(false)


function handleKeyDown(e: KeyboardEvent) {
  const key = e.key.toLowerCase()
  if (key === 'i') showInventory.value = true
  if (key === 'e') showEquipment.value = true
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
  bottom: 20px;
  left: 450px;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

button {
  background: #BD6A62;
  border: 3px solid #52333F;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

button img {
  width: 100%;
  image-rendering: pixelated;
}
</style>
