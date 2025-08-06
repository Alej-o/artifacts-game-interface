<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">

      <!-- VITAL -->
      <section class="stats-card">
        <div class="stats-card-header">
          <span class="icon">❤️</span>
          <span class="title">Vital</span>
        </div>
        <ul class="stats-card-body">
          <li><span>Max HP :</span> <strong>{{ stats?.max_hp }}</strong></li>
          <li><span>Haste :</span> <strong>{{ stats?.haste }}</strong></li>
          <li><span>Critical Strike :</span> <strong>{{ stats?.critical_strike }}</strong></li>
          <li><span>Wisdom :</span> <strong>{{ stats?.wisdom }}</strong></li>
          <li><span>Prospecting :</span> <strong>{{ stats?.prospecting }}</strong></li>
        </ul>
      </section>

      <!-- ATTACKS -->
      <section class="stats-card">
        <div class="stats-card-header">
          <span class="icon">⚔️</span>
          <span class="title">Attacks</span>
        </div>
        <ul class="stats-card-body">
          <li><span>Fire :</span> <strong>{{ stats?.attack_fire }}</strong></li>
          <li><span>Earth :</span> <strong>{{ stats?.attack_earth }}</strong></li>
          <li><span>Water :</span> <strong>{{ stats?.attack_water }}</strong></li>
          <li><span>Air :</span> <strong>{{ stats?.attack_air }}</strong></li>
        </ul>
      </section>

      <!-- DAMAGES -->
      <section class="stats-card">
        <div class="stats-card-header">
          <span class="icon">⚡️</span>
          <span class="title">Damages</span>
        </div>
        <ul class="stats-card-body">
          <li><span>Neutral :</span> <strong>{{ stats?.dmg }}</strong></li>
          <li><span>Fire :</span> <strong>{{ stats?.dmg_fire }}</strong></li>
          <li><span>Earth :</span> <strong>{{ stats?.dmg_earth }}</strong></li>
          <li><span>Water :</span> <strong>{{ stats?.dmg_water }}</strong></li>
          <li><span>Air :</span> <strong>{{ stats?.dmg_air }}</strong></li>
        </ul>
      </section>

      <!-- RESISTANCES -->
      <section class="stats-card">
        <div class="stats-card-header">
          <span class="icon">🛡️</span>
          <span class="title">Resistances</span>
        </div>
        <ul class="stats-card-body">
          <li><span>Fire :</span> <strong>{{ stats?.res_fire }}</strong></li>
          <li><span>Earth :</span> <strong>{{ stats?.res_earth }}</strong></li>
          <li><span>Water :</span> <strong>{{ stats?.res_water }}</strong></li>
          <li><span>Air :</span> <strong>{{ stats?.res_air }}</strong></li>
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
  background: #21381b;
  color: #f8f8f8;
  border: 2.5px solid #43633e;
  padding: 28px 30px 22px 30px;
  border-radius: 17px;
  min-width: 340px;
  max-width: 92vw;
  max-height: 95vh;
  box-shadow: 0 8px 32px #000b;
  overflow-y: auto;
  position: relative;
}

.stats-card {
  background: #253920;
  border: 2px solid #344634;
  border-radius: 12px;
  margin-bottom: 17px;
  box-shadow: 0 1px 7px #0002 inset;
  overflow: hidden;
  padding: 0;
}
.stats-card-header {
  display: flex;
  align-items: center;
  gap: 9px;
  background: linear-gradient(90deg, #2d492d 80%, #3d674a 100%);
  padding: 11px 16px 9px 14px;
  border-bottom: 1.5px solid #3b5644;
  font-size: 17px;
  font-weight: bold;
  color: #e7ffd6;
  letter-spacing: .04em;
}
.stats-card-header .icon {
  font-size: 21px;
  margin-right: 2px;
  color: #e66987;
  text-shadow: 0 1px 3px #1115;
}
.stats-card-header .title {
  font-size: 15.5px;
  font-weight: 900;
  letter-spacing: .04em;
}
.stats-card-body {
  list-style: none;
  margin: 0;
  padding: 14px 20px 12px 17px;
}
.stats-card-body li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15.3px;
  margin-bottom: 7px;
  color: #e7ffd6;
  letter-spacing: 0.01em;
}
.stats-card-body li:last-child { margin-bottom: 0; }
.stats-card-body strong {
  color: #b7f183;
  font-weight: 700;
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
.close-btn:hover { background: #364d39; }
</style>
