<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
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
                class="item-icon"
              />
            </template>
            <template v-else>
              <div class="empty">{{ formatSlot(slot) }}</div>
            </template>
          </div>

          <div class="player" style="grid-area: player">
            <img
              v-if="player?.skin"
              :src="`https://www.artifactsmmo.com/images/characters/${player.skin}.png`"
              alt="Player"
            />
          </div>
        </div>

        
        <div class="inventory-area">
          <div class="inventory-header">
            <img src="https://www.artifactsmmo.com/images/items/backpack.png" alt="Inventaire" class="header-icon"/>
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
          <button class="item-info-close" @click="closeItemInfo">✕</button>
          <div class="item-info-header">
            <img :src="`https://www.artifactsmmo.com/images/items/${itemInfo.code}.png`" :alt="itemInfo.name" class="info-icon"/>
            <div>
              <strong class="info-name">{{ itemInfo.name }}</strong>
              <div class="info-type">Niveau {{ itemInfo.level }} — {{ itemInfo.type }}</div>
            </div>
          </div>
          <div class="info-desc">{{ itemInfo.description }}</div>
          <div v-if="itemInfo.effects && itemInfo.effects.length" class="info-effects">
            <div v-for="effect in itemInfo.effects" :key="effect.code">
              <span class="effect-code">{{ effect.code }}</span>
              <span class="effect-value">{{ effect.value > 0 ? '+' : '' }}{{ effect.value }}</span>
              <span class="effect-desc" v-if="effect.description">({{ effect.description }})</span>
            </div>
          </div>
          <div v-if="itemInfo.craft" class="info-craft">
            <div>Craft : {{ itemInfo.craft.skill }} (niveau {{ itemInfo.craft.level }})</div>
            <div v-for="c in itemInfo.craft.items" :key="c.code" class="info-craft-item">
              <img :src="`https://www.artifactsmmo.com/images/items/${c.code}.png`" :alt="c.code" class="info-craft-icon"/>
              x{{ c.quantity }}
            </div>
          </div>
          <div v-if="itemInfo.tradeable === false" class="info-tradeable">Non échangeable</div>
        </div>
      </div>

      <button class="close-btn" @click="$emit('close')">Fermer</button>
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
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #111d17;
  color: #fff;
  border: 3px solid #344634;
  padding: 24px 28px;
  border-radius: 12px;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
  min-width: 650px;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 4px 40px #000a;
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
  font-size: 20px;
  color: #f8f8f8;
  letter-spacing: 2.5px;
  text-shadow: 1px 1px 0 #344634, 2px 2px 0 #0008;
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
  background: #16221c;
  border: 3px solid #344634;
  padding: 8px 4px;
  text-align: center;
  font-family: inherit;
  font-size: 13px;
  border-radius: 7px;
  color: #f8f8f8;
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
  color: #a8e4c3;
  font-family: inherit;
}

.item-code {
  font-size: 10px;
  color: #dfb897;
  margin-top: 3px;
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
  background: #262f23;
  border: 2.5px solid #82bc80;
  color: #fff;
  font-weight: bold;
  font-size: 15px;
  padding: 7px 18px;
  border-radius: 8px;
  display: block;
  margin: 28px auto 0;
  box-shadow: 0 2px 8px #000a;
  font-family: inherit;
  cursor: pointer;
  transition: background .18s;
}
.close-btn:hover {
  background: #364d39;
}

.item-info-card {
  position: absolute;
  right: 18px;
  bottom: 12px;
  min-width: 240px;
  max-width: 295px;
  background: #16221c;
  border: 3px solid #344634;
  border-radius: 10px;
  box-shadow: 0 8px 32px #000c, 0 1px 0 #344634 inset;
  color: #f8f8f8;
  padding: 16px 18px 13px 16px;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
  font-size: 14px;
  z-index: 99;
  animation: fadeIn .15s;
  pointer-events: auto;
  user-select: text;
}

.item-info-close {
  position: absolute;
  top: 7px;
  right: 9px;
  background: none;
  border: none;
  color: #a8e4c3;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  opacity: 0.72;
  transition: opacity 0.13s;
  z-index: 1;
}
.item-info-close:hover {
  opacity: 1;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
}
.item-info-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}
.info-icon {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  background: #232c28;
  border: 2px solid #2a4534;
  image-rendering: pixelated;
  flex-shrink: 0;
}
.info-name {
  color: #a8e4c3;
  font-size: 18px;
  text-shadow: 1px 1px 0 #344634;
  font-family: inherit;
}
.info-type {
  color: #dfb897;
  font-size: 13px;
  margin-top: 1px;
}
.info-desc {
  margin: 9px 0 6px 0;
  color: #e7ecd8;
  font-size: 14px;
}
.info-effects {
  margin: 5px 0 3px 0;
  font-size: 14px;
}
.effect-code {
  color: #a8e4c3;
  margin-right: 7px;
  font-weight: bold;
}
.effect-value {
  color: #8ef587;
  margin-right: 7px;
}
.effect-desc {
  color: #888;
  font-size: 12px;
}
.info-craft {
  margin: 6px 0 0 0;
  color: #8bd3a6;
  font-size: 13px;
}
.info-craft-item {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 2px 0 0 12px;
}
.info-craft-icon {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  background: #232c28;
  border: 1.5px solid #2a4534;
  image-rendering: pixelated;
  flex-shrink: 0;
}
.info-tradeable {
  color: #e57373;
  font-size: 12px;
  margin-top: 5px;
}

</style>
