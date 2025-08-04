<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div v-if="player" class="content-layout">
        
        <!-- Colonne Équipement -->
        <div class="equipment-grid">
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

        <!-- Colonne Inventaire -->
        <div class="inventory-grid">
          <div
            v-for="item in player.inventory"
            :key="item.slot"
            class="inventory-slot"
          >
            <template v-if="item.code">
              <img
                :src="`https://www.artifactsmmo.com/images/items/${item.code}.png`"
                :alt="item.code"
                class="item-icon"
              />
              <span class="quantity">x{{ item.quantity }}</span>
            </template>
            <template v-else>
              <div class="empty">Empty</div>
            </template>
          </div>
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
  min-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

/* Layout 2 colonnes */
.content-layout {
  display: flex;
  gap: 20px;
}

/* --- Équipement --- */
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
  gap: 10px;
  justify-content: center;
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

.player img {
  width: 60px;
  height: auto;
  image-rendering: pixelated;
}

/* --- Inventaire --- */
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, 60px);
  gap: 8px;
  align-content: start;
}

.inventory-slot {
  background: #FFC2A1;
  border: 2px solid #52333F;
  border-radius: 4px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.quantity {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 10px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
  padding: 1px 3px;
  border-radius: 3px;
}

.close-btn {
  background: #bd6a62;
  border: 3px solid #52333F;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  display: block;
  margin: 1rem auto 0;
  border-radius: 6px;
}
</style>

function formatSlot(slot: string) {
  return slot.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}


function guessSlotForItem(code: string): string {
  if (code.includes('amulet')) return 'amulet'
  if (code.includes('helmet')) return 'helmet'
  if (code.includes('armor')) return 'body'
  if (code.includes('ring')) return code.endsWith('2') ? 'ring2' : 'ring1'
  if (code.includes('sword') || code.includes('bow') || code.includes('staff')) return 'weapon'
  if (code.includes('shield')) return 'shield'
  if (code.includes('boots')) return 'boots'
  if (code.includes('rune')) return 'rune'
  if (code.includes('artifact')) return 'artifact1' 
  return 'weapon'
}


function equip(item: { code: string; quantity: number }) {
  const slot = guessSlotForItem(item.code)
  equipItem(item.code, slot, 1)
}
function unequip(slot: string) {
  unequipItem(slot)
}