<template>
  <div class="item-modal-docked" @click.self="$emit('closeDetails')" aria-modal="true" role="dialog">
    <div class="item-modal" @click.stop tabindex="0">
      <button class="close-btn modal-close-btn" @click="$emit('closeDetails')" aria-label="Close">×</button>

      <div class="item-modal-content">
        <div v-if="loadingDetail" class="details-loading">Loading…</div>
        <div v-else-if="selectedItem" class="item-details-content">
          <div class="details-header">
            <div>
              <div class="details-title">{{ selectedItem.name }}</div>
              <div class="details-level">Level {{ selectedItem.level }}</div>
            </div>
            <img :src="selectedItem.icon" class="details-icon" :alt="selectedItem.name" />
          </div>
          <div class="details-section"><b>Type:</b> {{ selectedItem.type || 'Unknown' }}</div>
          <div class="details-section" v-if="selectedItem.description">
            <b>Description:</b>
            <div class="desc">{{ selectedItem.description }}</div>
          </div>
          <div class="details-section" v-if="selectedItem.effects?.length">
            <b>Effects:</b>
            <ul class="effects-list">
              <li v-for="effect in selectedItem.effects" :key="effect.code">
                <span class="effect-value">{{ formatEffectValue(effect) }}</span>
                <span class="effect-label">{{ formatEffectLabel(effect) }}</span>
              </li>
            </ul>
          </div>

          <div class="details-section" v-if="selectedItem.conditions?.length">
            <b>Condition:</b>
            <ul class="condition-list">
              <li
                v-for="cond in selectedItem.conditions"
                :key="cond.code"
                :class="getConditionStatus(cond)"
              >
                {{ formatCondition(cond) }}
              </li>
            </ul>
          </div>

          <div class="details-section" v-if="selectedItem.craftItems?.length">
            <b>Required materials:</b>
            <ul class="effects-list">
              <li v-for="need in selectedItem.craftItems" :key="need.code">
                <img :src="getItemIcon(need.code)" class="need-icon" />
                <span class="need-name">{{ getItemName(need.code) }}</span>
                × <span :class="{ enough: hasEnough(need.code, need.value * quantity), notenough: !hasEnough(need.code, need.value * quantity) }">
                  ({{ playerQuantity(need.code) }}/{{ need.value * quantity }})
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="craft-controls-row">
        <button
          class="craft-action-btn"
          :disabled="!canCraft(selectedItem, quantity) || craftingId === selectedItem.code || !meetsAllConditions(selectedItem)"
          @click="$emit('craft', selectedItem, quantity)">
          <span v-if="craftingId === selectedItem.code">Crafting...</span>
          <span v-else>Craft</span>
        </button>
        <div class="quantity-controls" v-if="selectedItem?.craftItems?.length">
          <button @click="decrement" :disabled="quantity <= 1">–</button>
          <input type="number" v-model="quantity" min="1" :max="maxCraftable(selectedItem)"
            style="width: 48px; text-align: center" />
          <button @click="increment" :disabled="quantity >= maxCraftable(selectedItem)">+</button>
          <span class="max-indicator">(max: {{ maxCraftable(selectedItem) }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayer } from '../../stores/usePlayer'

const props = defineProps<{
  selectedItem: any
  loadingDetail: boolean
  craftingId: string | null
  getItemIcon: (code: string) => string
  getItemName: (code: string) => string
  hasEnough: (code: string, need: number) => boolean
  canCraft: (item: any, quantity?: number) => boolean
  playerQuantity: (code: string) => number
  formatEffectLabel: (effect: any) => string
  formatEffectValue: (effect: any) => string
}>()
const emit = defineEmits(['closeDetails', 'craft'])

const { player } = storeToRefs(usePlayer())

const quantity = ref(1)

function maxCraftable(item: any): number {
  if (!item?.craftItems) return 1
  const maxByMats = Math.min(
    ...item.craftItems.map((need: any) =>
      Math.floor(props.playerQuantity(need.code) / (need.value || 1))
    )
  )
  if (!meetsAllConditions(item)) return 0
  return Math.max(0, Math.min(maxByMats, 99))
}
function increment() {
  quantity.value = Math.min(maxCraftable(props.selectedItem), quantity.value + 1)
}
function decrement() {
  quantity.value = Math.max(1, quantity.value - 1)
}
watch(() => props.selectedItem, () => { quantity.value = 1 })

function formatCondition(cond: any): string {
  if (cond.code === 'level') return `Level > ${cond.value}`
  return `${capitalizeFirst(cond.code.replace('_level', ''))} Level > ${cond.value}`
}
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
function checkCondition(cond: any): boolean {
  if (!player.value) return false
  if (cond.code === 'level') return player.value.level > cond.value
  const skillValue = player.value??[cond.code]
  return typeof skillValue === 'number' && skillValue > cond.value
}
function meetsAllConditions(item: any): boolean {
  if (!item?.conditions || item.conditions.length === 0) return true
  return item.conditions.every(checkCondition)
}
function getConditionStatus(cond: any): 'valid' | 'invalid' {
  return checkCondition(cond) ? 'valid' : 'invalid'
}
</script>

<style scoped>
.item-modal-docked {
  position: relative;
  margin-left: 24px;
  z-index: 12;
  display: flex;
  align-items: center;
  height: 100%;
}
.item-modal {
  min-width: 260px;
  max-width: 325px;
  max-height: 520px;
  background: #21381b;
  border-radius: 15px;
  box-shadow: 0 8px 32px #000b, 0 1px 0 #3c3e2c;
  padding: 28px 23px 18px 23px;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 2.5px solid #43633e;
  overflow: hidden;
}

.item-modal-content {
  flex: 1 1 auto;
  min-height: 0;
  max-height: 410px; 
  overflow-y: auto;
  padding-right: 12px;
  scrollbar-width: thin;

}

.modal-close-btn {
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
.modal-close-btn:hover { background: #3cb162; }

.details-header {
  display: flex;
  margin-bottom: 8px;
  gap: 30px;
}
.details-header > div {
  max-width: 60%;
  width: auto;       
  min-width: 0;      
  flex-grow: 0;      
  flex-shrink: 1; 
}
.details-icon {
  width: 54px;
  height: 54px;
  border-radius: 7px;
  flex-shrink: 0;
}
.details-title {
  font-size: 19px;
  color: #ffe792;
  font-weight: bold;
  letter-spacing: .02em;
  width: fit-content;
}
.details-level {
  color: #9eff7b;
  font-size: 14px;
}
.details-section {
  margin: 13px 0 0 0;
  font-size: 14px;
  color: #e7ffd6;
}
.details-section b {
  color: #fffac0;
  font-weight: 900;
  font-size: 1.01em;
  margin-right: 3px;
}

.effects-list,
.condition-list {
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
}
.effects-list li {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 0;
  font-size: 15px;
  border-radius: 7px;
  position: relative;
  padding-left: 17px;
}
.effects-list li::before {
  content: '';
  display: inline-block;
  width: 7px; height: 7px;
  background: #ffe792;
  border-radius: 50%;
  position: absolute;
  left: 0; top: 13px;
  opacity: 0.87;
}
.condition-list li {
  font-size: 15px;
  padding: 3px 0;
}
.condition-list .valid {
  color: #aaff98;
  font-weight: 700;
}
.condition-list .invalid {
  color: #ff7c7c;
  font-weight: 700;
}

.effect-value {
  font-weight: 900;
  color: #b7f183;
  text-align: left;
  font-size: 16px;
  letter-spacing: 0.04em;
  min-width: 0;
}
.effect-label {
  color: #ffe792;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.01em;
}
.need-icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
  vertical-align: middle;
  border-radius: 4px;
  background: #293e2d;
  border: 2px solid #2a4534;
  box-shadow: 1px 1px 0 #212, 0 2px 6px #0005;
}
.need-name { color: #fce398; font-weight: 600; }
.enough { color: #70e088; }
.notenough { color: #ea3d4d; font-weight: bold; }

.craft-action-btn {
  background: #277b3a;
  color: #ffe792;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  padding: 0px 20px;
  font-weight: bold;
  height: 41px;
  cursor: pointer;
  transition: background 0.14s;
  box-shadow: 0 2px 9px #0a1c0a3b;
}
.craft-action-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.craft-action-btn:hover:not(:disabled) { background: #39a753; }

.craft-controls-row {
  display: flex;
  align-items: stretch;
  margin-top: 20px;
  gap: 16px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 0;
  background: #273a20;
  padding: 0 10px;
  border-radius: 7px;
  border: 1.5px solid #3c4f2e;
  height: 41px;
}
.quantity-controls input {
  background: #1a2812;
  color: #ffe792;
  border: 1px solid #3c4f2e;
  border-radius: 4px;
  font-size: 15px;
  padding: 2px 4px;
  outline: none;
}
.quantity-controls button {
  background: #40653c;
  color: #ffe792;
  border: none;
  font-size: 18px;
  border-radius: 4px;
  width: 25px; height: 25px;
  cursor: pointer;
  transition: background 0.13s;
  font-weight: bold;
}
.quantity-controls button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.quantity-controls button:not(:disabled):hover { background: #59ad5a; }
.max-indicator { color: #b6cfa7; margin-left: 7px; font-size: 13px; }

.quantity-controls input::-webkit-outer-spin-button,
.quantity-controls input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.quantity-controls input[type="number"] {
  -moz-appearance: textfield;
}

.details-loading {
  color: #fff;
  text-align: center;
  padding: 24px 0;
}
.desc { color: #e6d2ad; margin-top: 2px; }

</style>
