<template>
  <div ref="mapContainer" class="map-container">
    <div class="all-maps-grid">
      <div v-for="(row, yIndex) in mapGrid" :key="yIndex" class="row">
        <div v-for="(tile, xIndex) in row" :key="xIndex" class="tile">
          <img v-if="tile" :src="getSkinUrl(tile.skin)" :alt="tile.name" />
          <div
            v-if="tile && currentPlayer && tile.x === currentPlayer.x && tile.y === currentPlayer.y"
            class="player-wrapper"
          >
            <p class="player-name">{{ currentPlayer.name }}</p>
            <img :src="getPlayerSkinUrl(currentPlayer.skin)" alt="Player" class="player" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isMoving" class="cooldown-overlay">Déplacement en cours...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watchEffect } from 'vue'
import { usePlayer } from '../stores/usePlayer'
import { useMap } from '../stores/useMap'

const { player, movePlayer } = usePlayer()
const { fetchCurrentMap } = useMap()

const mapContainer = ref<HTMLDivElement | null>(null)
const isMoving = ref(false)
const currentPlayer = computed(() => player ?? null)
const mapGrid = ref<(MapTile | null)[][]>([])

let minX = 0
let minY = 0

interface MapTile {
  name: string
  skin: string
  x: number
  y: number
  content: any
}

function getSkinUrl(skin: string): string {
  return `https://www.artifactsmmo.com/images/maps/${skin}.png`
}

function getPlayerSkinUrl(skin: string): string {
  return `https://www.artifactsmmo.com/images/characters/${skin}.png`
}

async function fetchAllMaps(): Promise<MapTile[]> {
  const allMaps: MapTile[] = []
  let page = 1
  const pageSize = 50
  let hasMore = true

  while (hasMore) {
    const res = await fetch(
      `https://api.artifactsmmo.com/maps?page=${page}&size=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ARTIFACT_TOKEN}`,
          Accept: 'application/json',
        },
      }
    )
    const json = await res.json()
    allMaps.push(...json.data)
    hasMore = page < json.pages
    page++
  }

  return allMaps
}

async function buildGrid() {
  if (!currentPlayer.value) {
    console.warn('Player not loaded yet, cannot build grid')
    return
  }

  const maps = await fetchAllMaps()

  const xValues = maps.map((m) => m.x)
  const yValues = maps.map((m) => m.y)
  minX = Math.min(...xValues)
  minY = Math.min(...yValues)

  const width = Math.max(...xValues) - minX + 1
  const height = Math.max(...yValues) - minY + 1

  const grid: (MapTile | null)[][] = Array.from({ length: height }, () =>
    Array(width).fill(null)
  )

  for (const tile of maps) {
    const y = tile.y - minY
    const x = tile.x - minX
    grid[y][x] = tile
  }

  mapGrid.value = grid
  await nextTick()
  centerCameraOnPlayer()
}

function centerCameraOnPlayer() {
  const playerData = currentPlayer.value
  const container = mapContainer.value
  if (!playerData || !container || !mapGrid.value.length) return

  const tileSize = 224
  const playerScreenX = (playerData.x - minX) * tileSize
  const playerScreenY = (playerData.y - minY) * tileSize

  container.scrollTo({
    top: playerScreenY - container.clientHeight / 2 + tileSize / 2,
    left: playerScreenX - container.clientWidth / 2 + tileSize / 2,
    behavior: 'instant',
  })
}

function maybeScrollIfNearEdge() {
  const playerData = currentPlayer.value
  const container = mapContainer.value
  if (!playerData || !container) return

  const tileSize = 224
  const visibleWidth = container.clientWidth
  const visibleHeight = container.clientHeight

  const playerScreenX = (playerData.x - minX) * tileSize
  const playerScreenY = (playerData.y - minY) * tileSize

  const scrollLeft = container.scrollLeft
  const scrollTop = container.scrollTop

  const margin = 150

  const leftEdge = scrollLeft + margin
  const rightEdge = scrollLeft + visibleWidth - margin
  const topEdge = scrollTop + margin
  const bottomEdge = scrollTop + visibleHeight - margin

  let shouldScroll = false
  let newScrollX = scrollLeft
  let newScrollY = scrollTop

  if (playerScreenX < leftEdge || playerScreenX > rightEdge) {
    shouldScroll = true
    newScrollX = playerScreenX - visibleWidth / 2 + tileSize / 2
  }

  if (playerScreenY < topEdge || playerScreenY > bottomEdge) {
    shouldScroll = true
    newScrollY = playerScreenY - visibleHeight / 2 + tileSize / 2
  }

  if (shouldScroll) {
    container.scrollTo({
      top: newScrollY,
      left: newScrollX,
      behavior: 'smooth',
    })
  }
}

async function handleKeyPress(event: KeyboardEvent) {
  if (isMoving.value || !currentPlayer.value) return

  let newX = currentPlayer.value.x
  let newY = currentPlayer.value.y

  switch (event.key) {
    case 'ArrowUp':
    case 'z':
      newY -= 1
      break
    case 'ArrowDown':
    case 's':
      newY += 1
      break
    case 'ArrowLeft':
    case 'q':
      newX -= 1
      break
    case 'ArrowRight':
    case 'd':
      newX += 1
      break
    default:
      return
  }

  isMoving.value = true
  const cooldown = await movePlayer(newX, newY)
  maybeScrollIfNearEdge()
  setTimeout(() => {
    isMoving.value = false
  }, (cooldown ?? 5) * 1000)
}


watchEffect(() => {
  if (currentPlayer.value) {
    fetchCurrentMap(currentPlayer.value.x, currentPlayer.value.y)
  }
})

onMounted(() => {
  buildGrid()
  window.addEventListener('keydown', handleKeyPress)

  if (mapContainer.value) {
    mapContainer.value.setAttribute('tabindex', '0')
    mapContainer.value.focus()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>




<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  outline: none;
}

.all-maps-grid {
  display: flex;
  flex-direction: column;
  width: max-content;
  height: max-content;
}

.row {
  display: flex;
}

.tile {
  width: 224px;
  height: 224px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tile img {
  object-fit: cover;
}

.player-wrapper {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  text-align: center;
}

.player {
  width: 50%;
  height: auto;
}

.player-name {
  font-size: 14px;
  color: white;
  background-color: rgba(138, 43, 226, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 2px;
}

.cooldown-overlay {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 9999;
}
</style>
