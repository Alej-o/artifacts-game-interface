<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
    

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

      <button class="close-btn" @click="$emit('close')">Fermer</button>
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
  background: #111d17;
  color: #f8f8f8;
  border: 3px solid #344634;
  padding: 26px 28px 22px 28px;
  border-radius: 15px;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
  min-width: 340px;
  max-width: 90vw;
  max-height: 92vh;
  box-shadow: 0 4px 40px #000a;
  overflow-y: auto;
  position: relative;
}


ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin: 5px 0;
  font-size: 15px;
}
.stats-group {
  margin-bottom: 18px;
  background: #16221c;
  border: 2px solid #344634;
  border-radius: 7px;
  padding: 13px 18px 11px 16px;
  box-shadow: 0 1px 4px #0006 inset;
}
.stats-group h3 {
  font-size: 15px;
  color: #a8e4c3;
  margin-bottom: 7px;
  letter-spacing: 1px;
  text-shadow: 0 1px 0 #0005;
}
strong {
  color: #dfb897;
  font-family: inherit;
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
</style>
