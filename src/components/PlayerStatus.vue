<template>
  <div class="player-status" v-if="currentPlayer">
    <div class="status-container">
      <div class="character-wrapper">
        <div class="name-lvl-row">
          <p class="name-text">{{ player?.name }}</p>
          <p class="level-text">Lvl {{ player?.level }}</p>
        </div>
        <div class="character">
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
.player-status {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 999;
  transform: scale(1.18);
  transform-origin: bottom left;
}

.status-container {
  display: flex;
  align-items: flex-end;
  background: #2a3e2a;
  border-radius: 14px;
  box-shadow: 0 2px 12px #0005;
  padding: 13px 20px 13px 13px;
  border: 2.5px solid var(--color-border);
}

.character-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.name-lvl-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3px;
}

.name-text {
  font-size: 15px;
  font-weight: bold;
  color: var(--color-text-reward, #ffe792);
  text-align: center;
  font-family: inherit;
  background: var(--color-bg-card-success, #152b1b);
  border-radius: 7px 0 0 7px;
  margin: 0;
  padding: 2px 9px 2px 9px;
  min-width: 56px;
}

.level-text {
  font-size: 15px;
  font-weight: bold;
  color: var(--color-success, #9eff7b);
  font-family: inherit;
  background: var(--color-bg-card-success, #152b1b);
  border-radius: 0 7px 7px 0;
  margin: 0;
  padding: 2px 9px 2px 9px;
  letter-spacing: 1px;
}

.character {
  width: 64px;
  height: 64px;
  background: var(--color-bg-main, #121b15);
  border: 3px solid var(--color-border, #344634);
  border-radius: 8px;
  box-shadow: 0 2px 6px #0004;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
  margin-bottom: 3px;
}

.player {
  width: 100%;
  margin-top: 10px;
  image-rendering: pixelated;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: 5px;
  min-width: 220px;
}

.hp-bar,
.xp-bar {
  position: relative;
  width: 220px;
  height: 16px;
  background: var(--color-bg-progress, #232a23);
  border: 2px solid var(--color-border, #344634);
  border-radius: 7px;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 0px;
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
  color: #fffce8;
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
  background: var(--color-bg-card-success, #152b1b);
  border: 2px solid var(--color-border, #344634);
  border-radius: 7px;
  box-shadow: 0 1px 3px #0003 inset;
  display: flex;
  align-items: center;
  gap: 3px;
  padding-left: 7px;
  margin-top: 3px;
}

.gold-bar .bar-text {
  color: var(--color-text-reward, #ffe792);
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  letter-spacing: 0.3px;
  margin-left: 3px;
}

.gold-bar::before {
  content: "💰";
  font-size: 17px;
  margin-right: 3px;
  filter: drop-shadow(0 1px 1px #0009);
}

.player, .modal-img {
  image-rendering: pixelated;
}
</style>
