<!-- components/PlayerStatus.vue -->
<template>
  <div class="player-status" v-if="currentPlayer">
    <div class="status-container">
      <div class="character-wrapper">
        <p class="level-text">Lvl {{ player?.level }}</p>
        <div class="character">
          <p class="name-text">{{ player?.name }}</p>
          <img :src="getPlayerSkinUrl(currentPlayer.skin)" alt="Player" class="player" />
        </div>
      </div>

      <div class="stats-section">
        <div class="hp-bar">
          <div class="hp-fill" :style="{ width: hpPercentage + '%' }"></div>
          <p class="bar-text">{{ player?.hp }} / {{ player?.max_hp }} HP</p>
        </div>
        <div class="xp-bar">
          <div class="xp-fill" :style="{ width: xpPercentage + '%' }"></div>
          <p class="bar-text">{{ player?.xp }} / {{ player?.max_xp }} XP</p>
        </div>
        <div class="gold-bar">
          <span class="icon">💰</span>
          <p class="bar-text">{{ player?.gold }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayer } from '../stores/usePlayer'

const { player } = usePlayer()
const currentPlayer = computed(() => player ?? null)

const hpPercentage = computed(() => {
  if (!player?.hp || !player?.max_hp) return 0
  return Math.max(0, (player.hp / player.max_hp) * 100)
})

const xpPercentage = computed(() => {
  if (!player?.xp || !player?.max_xp) return 0
  return Math.max(0, (player.xp / player.max_xp) * 100)
})

function getPlayerSkinUrl(skin: string): string {
  return `https://www.artifactsmmo.com/images/characters/${skin}.png`
}
</script>

<style scoped>
/* même style que précédemment */
.player-status {
  position: fixed;
  bottom: 20px;
  left: 26px;
  display: flex;
  flex-direction: column;
  z-index: 998;
  transform: scale(1.3);
  transform-origin: bottom left;
}

.status-container {
  display: flex;
  align-items: flex-end;
}

.name-text {
  font-size: 15px;
  font-weight: bold;
  color: #fce8db;
  width: 64px;
  text-align: center;
  font-family: sans-serif;
  margin: 0 0 0px 0;
  z-index: 999;
}

.character {
  width: 64px;
  height: 64px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #BD6A62;
  border: 3px solid #52333F;
  border-radius: 4px;
  padding: 2px;
}
.player {
  width: 100%;
  image-rendering: pixelated;
}

.stats-section {
  display: flex;
  flex-direction: column;
  position: relative;
}

.character-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-text {
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  font-family: sans-serif;
  margin-bottom: 2px;
  margin-top: 0;
}

.hp-bar,
.xp-bar {
  position: relative;
  width: 220px;
  height: 15px;
  background-color: #BD6A62;
  border: 3px solid #52333F;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hp-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #AD2F45;
  transition: width 0.3s ease;
  z-index: 0;
}

.xp-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #f7a800;
  transition: width 0.3s ease;
  z-index: 0;
}

.bar-text {
  position: relative;
  z-index: 1;
  color: white;
  font-size: 11px;
  font-weight: bold;
  font-family: sans-serif;
}

.gold-bar {
  width: 110px;
  height: 22px;
  background-color: #BD6A62;
  border: 3px solid #52333F;
  border-bottom-right-radius: 3px;
  overflow: hidden;
  display: flex;
  align-items: center;  
  justify-content: left;
  gap: 4px;
  padding-left: 4px;
}
</style>
