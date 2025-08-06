<template>
  <div class="item-modal-docked" @click.self="$emit('closeDetails')" aria-modal="true" role="dialog">
    <div class="item-modal" @click.stop tabindex="0">
      <button class="close-btn modal-close-btn" @click="$emit('closeDetails')" aria-label="Close">×</button>
      <div v-if="loadingDetail" class="details-loading">Loading…</div>
      <div v-else-if="selectedItem" class="item-details-content">
        <div class="details-header">
          <div>
            <div class="details-title">{{ selectedItem.name }}</div>
            <div class="details-level">Level {{ selectedItem.level }}</div>
          </div>
          <img :src="selectedItem.icon" class="details-icon" :alt="selectedItem.name" />
        </div>
        <div class="details-section"><b>Type :</b> {{ selectedItem.type || 'Unknown' }}</div>
        <div class="details-section" v-if="selectedItem.description">
          <b>Description</b>
          <div class="desc">{{ selectedItem.description }}</div>
        </div>
        <div class="details-section" v-if="selectedItem.effects?.length">
          <b>Effects</b>
          <ul class="effects-list">
            <li v-for="effect in selectedItem.effects" :key="effect.code">
              <span class="effect-value">{{ formatEffectValue(effect) }}</span>
              <span class="effect-label">{{ formatEffectLabel(effect) }}</span>
            </li>
          </ul>
        </div>
        <div class="details-section" v-if="selectedItem.craftItems?.length">
          <b>Required materials :</b>
          <ul>
            <li v-for="need in selectedItem.craftItems" :key="need.code">
              <img :src="getItemIcon(need.code)" class="need-icon" />
              <span class="need-name">{{ getItemName(need.code) }}</span>
              × <span :class="{ enough: hasEnough(need.code, need.value), notenough: !hasEnough(need.code, need.value) }">
                ({{ playerQuantity(need.code) }}/{{ need.value }})
              </span>
            </li>
          </ul>
        </div>
        <button
          class="craft-action-btn"
          :disabled="!canCraft(selectedItem) || craftingId === selectedItem.code"
          @click="$emit('craft', selectedItem)">
          <span v-if="craftingId === selectedItem.code">Crafting...</span>
          <span v-else>Craft</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedItem: any
  loadingDetail: boolean
  craftingId: string | null
  getItemIcon: (code: string) => string
  getItemName: (code: string) => string
  hasEnough: (code: string, need: number) => boolean
  canCraft: (item: any) => boolean
  playerQuantity: (code: string) => number
  formatEffectLabel: (effect: any) => string
  formatEffectValue: (effect: any) => string
}>()
defineEmits(['closeDetails', 'craft'])
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
  padding: 22px 23px 18px 23px;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 2.5px solid #43633e;
  overflow-y: auto;
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
.details-header { display: flex; align-items: center; gap: 18px; margin-bottom: 8px;}
.details-icon { width: 54px; height: 54px; border-radius: 7px; }
.details-title { font-size: 19px; color: #ffe792; font-weight: bold; letter-spacing: .02em;}
.details-level { color: #9eff7b; font-size: 14px; }
.details-section { margin: 13px 0 0 0; font-size: 14px; color: #e7ffd6;}
.details-section b {
  color: #fffac0;
  font-weight: 900;
  font-size: 1.01em;
  margin-right: 3px;
}
.effects-list {
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
}
.effects-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 5px 0 5px 0;
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
.effect-value {
  font-weight: 900;
  color: #ffe792;
  min-width: 38px;
  text-align: right;
  font-size: 16px;
  letter-spacing: 0.04em;
}
.effect-label {
  color: #b7f183;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.01em;
}
.need-icon { width: 18px; height: 18px; margin-right: 4px; vertical-align: middle;  border-radius: 4px;
  background: #293e2d;
  border: 2px solid #2a4534;
  box-shadow: 1px 1px 0 #212, 0 2px 6px #0005; }
.need-name { color: #fce398; font-weight: 600; }
.enough { color: #70e088; }
.notenough { color: #ea3d4d; font-weight: bold;}
.craft-action-btn {
  background: #277b3a;
  color: #ffe792;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  padding: 8px 20px;
  font-weight: bold;
  margin-top: 19px;
  cursor: pointer;
  transition: background 0.14s;
  box-shadow: 0 2px 9px #0a1c0a3b;
}
.craft-action-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.craft-action-btn:hover:not(:disabled) { background: #39a753; }
.details-loading { color: #fff; text-align: center; padding: 24px 0; }
.desc { color: #e6d2ad; margin-top: 2px; }
</style>
