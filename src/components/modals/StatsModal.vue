<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>Player Stats</h2>

      <section class="stats-group">
        <h3>❤️ Vital</h3>
        <ul>
          <li><strong>Max HP:</strong> {{ stats?.max_hp }}</li>
          <li><strong>Haste:</strong> {{ stats?.haste }}</li>
          <li><strong>Critical Strike:</strong> {{ stats?.critical_strike }}</li>
          <li><strong>Wisdom:</strong> {{ stats?.wisdom }}</li>
          <li><strong>Prospecting:</strong> {{ stats?.prospecting }}</li>
        </ul>
      </section>

      <section class="stats-group">
        <h3>⚔️ Attacks</h3>
        <ul>
          <li><strong>Fire:</strong> {{ stats?.attack_fire }}</li>
          <li><strong>Earth:</strong> {{ stats?.attack_earth }}</li>
          <li><strong>Water:</strong> {{ stats?.attack_water }}</li>
          <li><strong>Air:</strong> {{ stats?.attack_air }}</li>
        </ul>
      </section>

      <section class="stats-group">
        <h3>⚡️ Damages</h3>
        <ul>
          <li><strong>Neutral:</strong> {{ stats?.dmg }}</li>
          <li><strong>Fire:</strong> {{ stats?.dmg_fire }}</li>
          <li><strong>Earth:</strong> {{ stats?.dmg_earth }}</li>
          <li><strong>Water:</strong> {{ stats?.dmg_water }}</li>
          <li><strong>Air:</strong> {{ stats?.dmg_air }}</li>
        </ul>
      </section>

      <section class="stats-group">
        <h3>🛡️ Resistances</h3>
        <ul>
          <li><strong>Fire:</strong> {{ stats?.res_fire }}</li>
          <li><strong>Earth:</strong> {{ stats?.res_earth }}</li>
          <li><strong>Water:</strong> {{ stats?.res_water }}</li>
          <li><strong>Air:</strong> {{ stats?.res_air }}</li>
        </ul>
      </section>

      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayer } from '../../stores/usePlayer'
import { computed } from 'vue'

defineEmits<{ (e: 'close'): void }>()

const { player } = usePlayer()
const stats = computed(() => player ?? null)
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
  background: #bd6a62;
  color: white;
  border: 3px solid #52333F;
  padding: 20px;
  border-radius: 8px;
  font-family: sans-serif;
  min-width: 320px;
  max-height: 90vh;
  overflow-y: auto;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin: 5px 0;
}
button {
  margin-top: 15px;
  background: #a94b45;
  border: 2px solid #52333F;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
}
.stats-group {
  margin-bottom: 15px;
}
.stats-group h3 {
  font-size: 16px;
  color: #fce8db;
  margin-bottom: 5px;
}
</style>
