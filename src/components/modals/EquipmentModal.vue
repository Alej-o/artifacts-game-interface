<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div v-if="player" class="equipment-grid">
        <div
          v-for="(itemCode, slot) in slots"
          :key="slot"
          class="slot"
          :style="{ gridArea: slot }"
        >
          <template v-if="itemCode">
            <img
              :src="`https://www.artifactsmmo.com/images/items/${itemCode}.png`"
              :alt="slot"
              class="item-icon"
            />
            <div class="item-code">{{ itemCode }}</div>
            <button class="btn-unequip" @click="unequip(slot)">Retirer</button>
          </template>
          <template v-else>
            {{ formatSlot(slot) }}
            <div class="empty">Empty</div>
          </template>
        </div>

        <div class="player" style="grid-area: player">
          <img
            :src="`https://www.artifactsmmo.com/images/characters/${player.skin}.png`"
            alt="Player"
          />
        </div>
      </div>

      <button class="close-btn" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayer } from '../../stores/usePlayer'

defineEmits<{ (e: 'close'): void }>()

const { player, unequipItem } = usePlayer()
const slots = computed(() => {
  const p = player ?? null
  return {
    amulet: p?.amulet_slot ?? null,
    helmet: p?.helmet_slot ?? null,
    body: p?.body_armor_slot ?? null,
    ring1: p?.ring1_slot ?? null,
    ring2: p?.ring2_slot ?? null,
    weapon: p?.weapon_slot ?? null,
    shield: p?.shield_slot ?? null,
    leg: p?.leg_armor_slot ?? null,
    boots: p?.boots_slot ?? null,
    rune: p?.rune_slot ?? null,
    artifact1: p?.artifact1_slot ?? null,
    artifact2: p?.artifact2_slot ?? null,
    artifact3: p?.artifact3_slot ?? null,
  }
})

function unequip(slot: string) {
  unequipItem(slot)
}

function formatSlot(slot: string) {
  return slot
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #BD6A62;
  color: white;
  border: 3px solid #52333F;
  padding: 20px;
  border-radius: 8px;
  font-family: sans-serif;
  min-width: 350px;
  max-height: 90vh;
  overflow-y: auto;
}

.equipment-grid {
  display: grid;
  grid-template-areas:
    "amulet   helmet     body"
    "ring1    .          leg"
    "ring2    player     boots"
    "weapon   .          shield"
    "artifact1 artifact2 artifact3"
    ".        rune       .";
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(6, auto);
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.slot {
  background: #FFC2A1;
  border: 3px solid #52333F;
  padding: 6px;
  text-align: center;
  font-family: monospace;
  font-size: 13px;
  border-radius: 5px;
  color: #52333F;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
}

.item-code {
  font-size: 12px;
  margin-bottom: 4px;
}

.empty {
  opacity: 0.5;
  font-style: italic;
  font-size: 12px;
}

.btn-unequip {
  background: #bd6a62;
  border: none;
  color: #52333F;
  font-size: 12px;
  padding: 4px 6px;
  margin-top: 4px;
  cursor: pointer;
  border-radius: 4px;
}

.btn-unequip:hover {
  background: #a94b45;
}

.player img {
  width: 60px;
  height: auto;
  image-rendering: pixelated;
}

.close-btn {
  background: #bd6a62;
  border: 3px solid #52333F;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  display: block;
  margin: 0 auto;
  border-radius: 6px;
}
</style>
