<template>
  <div class="coordination" v-if="map">
    <p>{{ map.name }}</p>
    <p>{{ map.x }}, {{ map.y }}</p>
    <p v-if="map.content?.code">{{ map.content.code }}</p>
  </div>

  <div class="player-status" v-if="currentPlayer">
    <div class="character">
      <img :src="getPlayerSkinUrl(currentPlayer.skin)" alt="Player" class="player" />
    </div>

    <div class="bars">
      <div class="hp-bar">
        <div class="hp-fill" :style="{ width: hpPercentage + '%' }"></div>
        <p class="bar-text">{{ player?.hp }} / {{ player?.max_hp }}</p>
      </div>
      <div class="xp-bar">
        <div class="xp-fill" :style="{ width: xpPercentage + '%' }"></div>
        <p class="bar-text">{{ player?.xp }} / {{ player?.max_xp }}</p>
      </div>
      <div class="gold-bar">
        <span class="icon">💰</span>
        <p class="bar-text">{{ player?.gold }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMap } from '../stores/useMap'
import { usePlayer } from '../stores/usePlayer'

const { player } = usePlayer()
const store = useMap()

const map = computed(() => store.currentMap)
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
.coordination {
  position: fixed;
  top: 20px;
  left: 25px;
  font-weight: bold;
  font-size: 20px;
  color: #faf5f2;
  font-family: sans-serif;
  z-index: 999;
  display: flex;
  gap: 15px;
}

.player-status {
  position: fixed;
  bottom: 20px;
  left: 26px;
  display: flex;
  align-items: flex-end;
  z-index: 998;
}

.character {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.character .player {
  width: 100%;
  height: auto;
  image-rendering: pixelated;
  object-position: 0px 18px;
    border: 2px solid #2F5753;
  background-color: #3B7D4F;
  border-radius: 4px;
}
.bars {
  display: flex;
  flex-direction: column;  
  gap: 0px;
}

.hp-bar,
.xp-bar {
  position: relative;
  width: 220px;
  height: 15px;
  background-color: #3B7D4F;
  border: 2px solid #2F5753;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
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
  background-color: #ff4b4b;
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
.gold-bar{
position: relative;
  width: 110px;
  height: 22px;
  background-color: #3B7D4F;
  border: 2px solid #2F5753;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 2px
}

</style>
