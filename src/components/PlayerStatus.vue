<template>
  <div class="player-status" v-if="currentPlayer">
    <div class="status-container">
      <div class="header-row">
        <p class="name-text">{{ player?.name }}</p>
        <span class="level-text">Lvl {{ player?.level }}</span>
      </div>
      <div class="main-row">
        <div class="character">
          <img :src="getPlayerSkinUrl(currentPlayer.skin)" alt="Player" class="player-img" />
        </div>
        <div class="bars-col">
          <div class="hp-bar">
            <div class="hp-fill" :style="{ width: hpPercentage + '%' }"></div>
            <span class="bar-text">{{ player?.hp }} / {{ player?.max_hp }} HP</span>
          </div>
          <div class="xp-bar">
            <div class="xp-fill" :style="{ width: xpPercentage + '%' }"></div>
            <span class="bar-text">{{ player?.xp }} / {{ player?.max_xp }} XP</span>
          </div>
          <div class="gold-bar">
            <span class="gold-emoji">💰</span>
            <span class="bar-text">{{ player?.gold }}</span>
          </div>
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
.player-status {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 999;
  transform: scale(1.18);
  transform-origin: bottom left;
}

.status-container {
  background: #21381B;
  border-radius: 12px;
  box-shadow: 0 2px 12px #0005;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 8px;
  border: 2.5px solid #43633e;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
  min-width: 320px;
  display: flex;
  flex-direction: column;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: left;
}

.name-text {
  font-size: 15px;
  font-weight: bold;
  color: #ffe792;
  background: #152b1b;
  border-radius: 7px 0 0 7px;
  padding: 2px 13px;
  min-width: 56px;
  letter-spacing: .02em;
}

.level-text {
  font-size: 15px;
  font-weight: bold;
  color: #9eff7b;
  background: #152b1b;
  border-radius: 0 7px 7px 0;
  padding: 2px 13px;
  letter-spacing: 1px;
}

.main-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 22px;
}

.character
{
  width: 64px;
  height: 64px;
  background: #152B1B;
  border: 2.5px solid #43633e;
  border-radius: 8px;
  box-shadow: 0 2px 6px #0004;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
  margin-bottom: 7px;
}

.player-img {
  width: 100%;
  image-rendering: pixelated;
}

.bars-col {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 220px;
}

.hp-bar,
.xp-bar {
  position: relative;
  width: 220px;
  height: 16px;
  background: #152B1B;
  border: 2px solid #344634;
  border-radius: 7px;
  overflow: hidden;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px #0003 inset;
}

.hp-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #AD2F45, #eb5271 70%);
  border-radius: 7px;
  transition: width 0.3s;
  z-index: 0;
}

.xp-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #F0B541, #ffe792 70%);
  border-radius: 7px;
  transition: width 0.3s;
  z-index: 0;
}

.bar-text {
  position: relative;
  z-index: 1;
  color: #FFFAC0;
  font-size: 12px;
  font-weight: bold;
  font-family: inherit;
  width: 100%;
  text-align: center;
  letter-spacing: .5px;
  text-shadow: 0 1px 2px #0005;
  pointer-events: none;
  user-select: none;
}

.gold-bar {
  width: 112px;
  height: 22px;
  background: #152b1b;
  border: 2px solid #344634;
  border-radius: 7px;
  box-shadow: 0 1px 3px #0003 inset;
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 9px;
  margin-top: 3px;
}

.gold-emoji {
  font-size: 17px;
  filter: drop-shadow(0 1px 1px #0009);
}

.gold-bar .bar-text {
  color: #ffe792;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  letter-spacing: 0.3px;
  margin-left: 3px;
}
</style>

