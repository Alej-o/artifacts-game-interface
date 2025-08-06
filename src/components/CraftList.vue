<template>
  <div class="craft-list-modal" @click.stop>
    <div class="craft-list-header">
      <span class="workshop-title">{{ workshopLabel }}</span>
      <button class="close-btn" @click="$emit('close')" aria-label="Close">×</button>
    </div>
    <div class="craft-list">
      <div
        v-for="item in crafts"
        :key="item.code"
        class="craft-list-item"
        @click="$emit('select', item.code)"
        tabindex="0"
        role="button"
        :aria-label="`Select ${item.name}`"
        @keydown.enter="$emit('select', item.code)"
      >
        <img :src="item.icon" class="item-icon" :alt="item.name" />
        <span class="item-name">{{ item.name }}</span>
        <span class="item-lvl">Lvl {{ item.level }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  crafts: any[]
  workshopLabel: string
}>()
defineEmits(['select', 'close'])
</script>

<style scoped>
.craft-list-modal {
  background: #1e331d;
  border-radius: 18px;
  border: 2.5px solid #4a604d;
  min-width: 350px;
  max-width: 420px;
  min-height: 510px;
  max-height: 86vh;
  box-shadow: 0 8px 32px #000c;
  overflow: hidden;
  display: flex; flex-direction: column;
  margin: 0;
}
.craft-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #223822;
  border-radius: 18px 18px 0 0;
  padding: 16px 20px 11px 22px;
  border-bottom: 2px solid #30502c;
  position: sticky;
  top: 0;
  z-index: 10;
  min-height: 44px;
}
.workshop-title {
  font-size: 18px;
  font-weight: bold;
  color: #fce398;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 1px #2228;
}
.craft-list {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 14px 8px 18px 8px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-height: 370px;
  max-height: 64vh;
  scrollbar-width: thin;
}
.craft-list-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 14px;
  border-radius: 10px;
  background: none;
  transition: background 0.15s;
  font-size: 15px;
}
.craft-list-item:focus,
.craft-list-item:hover { background: #263c22; outline: none; }
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
.item-name { color: #fce398; font-weight: bold; font-size: 15px; flex: 1; }
.item-lvl { color: #b7f183; font-size: 13px; font-weight: bold; }
.close-btn {
  background: #2d422b;
  border: none;
  color: #ffe792;
  border-radius: 50%;
  font-size: 23px;
  width: 29px; height: 29px;
  cursor: pointer;
  font-weight: bold;
  z-index: 2;
  transition: background 0.12s;
}
.close-btn:hover { background: #496e3d; }
</style>
