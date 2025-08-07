<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <button class="close-btn" @click="$emit('close')" aria-label="Close">×</button>
      <div class="modal-content">
        
        <div class="equipment-grid">
          <div
            v-for="(itemCode, slot) in slots"
            :key="slot"
            class="slot"
            :class="{ 'drag-over': dragTarget === slot, selected: selectedItem === itemCode }"
            :style="{ gridArea: slot }"
            @click="itemCode && selectItem(itemCode)"
            @dblclick="itemCode && unequip(slot)"
            draggable="true"
            @dragstart="onDragStart(slot, itemCode)"
            @drop.prevent="onDrop"
            @dragover.prevent="onDragOver(slot)"
            @dragleave="onDragLeave"
          >
            <template v-if="itemCode">
              <img
                :src="`https://www.artifactsmmo.com/images/items/${itemCode}.png`"
                :alt="slot"
                class="item-icon equipped"
              />
            </template>
            <template v-else>
              <div class="empty">{{ formatSlot(slot) }}</div>
            </template>
          </div>
          <div class="player" style="grid-area: player">
            <img v-if="player?.skin" :src="`https://www.artifactsmmo.com/images/characters/${player.skin}.png`" alt="Player"/>
          </div>
        </div>

        
        <div class="inventory-area">
          <div class="inventory-header">
            <img src="https://www.artifactsmmo.com/images/items/backpack.png" alt="Inventory" class="header-icon"/>
            <span class="inventory-header-title">INVENTORY</span>
          </div>
          <div class="inventory-grid">
            <div
              v-for="item in player?.inventory"
              :key="item.slot"
              class="inventory-slot"
              :class="{ 'drag-over': dragTarget === 'inventory', selected: selectedItem === item.code }"
              @click="item.code && selectItem(item.code)"
              @dblclick="item.code && equip(item)"
              draggable="true"
              @dragstart="onDragStart('inventory', item.code)"
              @drop.prevent="onDrop"
              @dragover.prevent="onDragOver('inventory')"
              @dragleave="onDragLeave"
            >
              <template v-if="item.code">
                <img
                  :src="`https://www.artifactsmmo.com/images/items/${item.code}.png`"
                  :alt="item.code"
                  class="item-icon"
                />
                <div class="quantity">x{{ item.quantity }}</div>
              </template>
              <template v-else>
                <div class="empty">Empty</div>
              </template>
            </div>
          </div>
        </div>

        
        <div v-if="itemInfo" class="item-info-card">
          <button class="close-btn" @click="closeItemInfo" aria-label="Close">×</button>
          <div class="item-info-header">
            <div>
              <span class="info-name">{{ itemInfo.name }}</span>
              <div class="info-type">Level {{ itemInfo.level }} — {{ itemInfo.type }}</div>
            </div>
            <img :src="`https://www.artifactsmmo.com/images/items/${itemInfo.code}.png`" :alt="itemInfo.name" class="info-icon"/>
          </div>

          <div class="info-section">
            <div class="info-desc">{{ itemInfo.description }}</div>
          </div>

          <div v-if="itemInfo.effects?.length" class="info-section">
            <div class="info-label">Effects:</div>
            <ul class="info-effects-list">
              <li v-for="effect in itemInfo.effects" :key="effect.code">
                <span class="dot"></span>
                <span class="effect-value" :class="{ heal: effect.code.toLowerCase().includes('heal') }">
                  {{ effect.value }}
                </span>
                <span class="effect-code">
                  {{
                    effect.code
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())
                  }}
                </span>
              </li>
            </ul>
          </div>

          <div v-if="itemInfo.craft" class="info-section">
            <div class="info-label">Required materials:</div>
            <ul class="craft-list">
              <li v-for="c in itemInfo.craft.items" :key="c.code">
                <span class="dot"></span>
                <img :src="`https://www.artifactsmmo.com/images/items/${c.code}.png`" :alt="c.code" class="craft-icon"/>
                <span class="craft-name">{{ c.name || c.code.replace('_', ' ') }}</span>
                <span class="craft-qty">×{{ c.quantity }}</span>
              </li>
            </ul>
          </div>

          <div v-if="itemInfo.tradeable === false" class="info-tradeable">Not tradeable</div>
        </div>
       

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlayer } from '../../stores/usePlayer'

defineEmits<{ (e: 'close'): void }>()
const { player, equipItem, unequipItem } = usePlayer()

const selectedItem = ref<string | null>(null)
const itemInfo = ref<any>(null)

async function selectItem(code: string) {
  if (selectedItem.value === code) return
  selectedItem.value = code
  itemInfo.value = null
  const res = await fetch(`https://api.artifactsmmo.com/items/${code}`, {
    headers: { Accept: 'application/json' }
  })
  const json = await res.json()
  itemInfo.value = json.data
}
function closeItemInfo() {
  selectedItem.value = null
  itemInfo.value = null
}

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
    bag: p?.bag_slot ?? null,           
    artifact1: p?.artifact1_slot ?? null,
    artifact2: p?.artifact2_slot ?? null,
    artifact3: p?.artifact3_slot ?? null,
  }
})

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
const dragData = ref<{ from: string; code: string | null }>({ from: '', code: null })
const dragTarget = ref<string | null>(null)
function onDragStart(from: string, code: string | null) {
  dragData.value = { from, code }
}
function onDrop() {
  dragTarget.value = null
  dragData.value = { from: '', code: null }
}
function onDragOver(target: string) {
  dragTarget.value = target
}
function onDragLeave() {
  dragTarget.value = null
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #21381b;
  color: #fff;
  border: 2.5px solid #43633e;
  padding: 24px 28px;
  border-radius: 12px;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
  min-width: 650px;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 4px 40px #000b, 0 1px 0 #3c3e2c;
  overflow-y: auto;
  position: relative;
}
.modal-content {
  display: flex;
  gap: 24px;
  min-height: 380px;
  position: relative;
}
.equipment-grid {
  display: grid;
  grid-template-areas:
    "amulet   helmet     body"
    "ring1    player     leg"
    "ring2    .     boots"
    "weapon   rune       shield"
    "artifact1 artifact2 artifact3"
    ".     bag   .";
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(6, auto);
  gap: 13px;
  min-width: 320px;
}
.inventory-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 320px;
}
.inventory-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  margin-top: 6px;
}
.header-icon {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
}
.inventory-header-title {
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
  font-size: 19px;
  color: #ffe792;
  letter-spacing: .02em;
  font-weight: bold;
  margin-top: 3px;
}
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, 60px);
  gap: 10px;
  align-content: flex-start;
}
.slot, .inventory-slot {
  background: #223822;
  padding: 8px 4px;
  text-align: center;
  font-family: inherit;
  font-size: 13px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 52px;
  box-shadow: 0 2px 6px #0005;
  transition: background .12s, border-color .15s, box-shadow .15s;
  cursor: pointer;
}
.slot:hover, .inventory-slot:hover {
  background: #1d2e22;
}
.slot.selected,
.inventory-slot.selected {
  box-shadow: 0 0 0 3px #70e088, 0 2px 8px #0008;
  border-color: #70e088;
  z-index: 2;
}
.item-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
  image-rendering: pixelated;
  border-radius: 4px;
  background: #293e2d;
  border: 2px solid #2a4534;
  box-shadow: 1px 1px 0 #212, 0 2px 6px #0005;
}
.quantity {
  font-size: 11px;
  color: #aaff98;
  font-family: inherit;
}
.empty {
  opacity: 0.48;
  font-style: italic;
  color: #a8e4c3;
}
.drag-over {
  outline: 3px dashed #f1d8a2;
  background: #293e2d
}
.player {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.player img {
  width: 60px;
  height: auto;
  image-rendering: pixelated;
  display: block;
  margin: 0 auto;
}
.close-btn {
  position: absolute;
  top: 13px;
  right: 15px;
  background: #284a31;
  border: none;
  color: #ffe792;
  border-radius: 50%;
  font-size: 21px;
  width: 29px;
  height: 29px;
  cursor: pointer;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 8px #0004;
  transition: background 0.14s;
}
.close-btn:hover { background: #3cb162; }

/* --- ITEM INFO CARD --- */
.item-info-card {
  position: absolute;
  right: 18px;
  bottom: 12px;
  min-width: 255px;
  max-width: 325px;
  background: #21381b;
  border: 2.5px solid #43633e;
  border-radius: 15px;
  box-shadow: 0 8px 32px #000b, 0 1px 0 #3c3e2c;
  color: #e7ffd6;
  padding: 18px 20px 16px 19px;
  font-family: inherit;
  font-size: 15px;
  z-index: 99;
  animation: fadeIn .14s;
  pointer-events: auto;
  user-select: text;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.item-info-close {
position: absolute;
  top: 13px;
  right: 15px;
  background: #284a31;
  border: none;
  color: #ffe792;
  border-radius: 50%;
  font-size: 21px;
  width: 29px;
  height: 29px;
  cursor: pointer;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 8px #0004;
  transition: background 0.14s;
}
.item-info-close:hover { background: #3cb162; opacity: 1; }
.item-info-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 2px;
}

.info-name {
  font-size: 18px;
  color: #ffe792;
  font-weight: bold;
  letter-spacing: .02em;
  margin-bottom: 1px;
  text-shadow: 1px 1px 0 #344634;
}
.info-type {
  color: #78e782;
  font-size: 13px;
  margin-top: 2px;
  font-weight: 700;
  letter-spacing: .01em;
}
.info-section {
  margin-top: 8px;
  margin-bottom: 3px;
}
.info-label {
  font-size: 15px;
  color: #fffac0;
  font-weight: bold;
  margin-bottom: 2px;
}
.info-desc {
  color: #fffac0;
  font-size: 14px;
  margin-top: 2px;
  font-family: inherit;
}
.info-effects-list {
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
}
.info-effects-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b7f183;
  font-size: 15px;
  margin-bottom: 2px;
}
.effect-value.heal {
  color: #78e782;
  font-weight: bold;
  font-size: 15px;
}
.effect-value {
  font-weight: bold;
  margin-right: 3px;
}
.effect-code {
  color: #ffe792;
  font-weight: bold;
  font-size: 14px;
  margin-left: 3px;
}
.effect-desc {
  color: #a8e4c3;
  font-size: 12px;
  margin-left: 4px;
}
.craft-list {
  list-style: none;
  padding: 0;
  margin-top: 4px;
}
.craft-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f5e6b7;
  font-size: 15px;
  margin-bottom: 2px;
}
.craft-icon {
  width: 21px;
  height: 21px;
  image-rendering: pixelated;
  background: #293e2d;
  border: 2px solid #2a4534;
   box-shadow: 1px 1px 0 #212, 0 2px 6px #0005;
  border-radius: 4px;
}
.craft-name {
  color: #ffe792;
  font-weight: 700;
}
.craft-qty {
  color: #b7f183;
  font-size: 14px;
  margin-left: 1px;
}
.dot {
  display: inline-block;
  width: 7px; height: 7px;
  background: #ffe792;
  border-radius: 50%;
  margin-right: 5px;
}
.info-tradeable {
  color: #ea3d4d;
  font-size: 13px;
  font-weight: bold;
  margin-top: 7px;
}
.slot {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  min-width: 50px;
}

.item-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
  image-rendering: pixelated;
  border-radius: 4px;
  background: #293e2d;
  border: 2px solid #2a4534;
  box-shadow: 1px 1px 0 #212, 0 2px 6px #0005;
}

.item-icon.equipped {
  width: 50px;
  height: 50px;
  max-width: 96%;
  max-height: 96%;
  margin: 0 auto;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  image-rendering: pixelated;
}
</style>
