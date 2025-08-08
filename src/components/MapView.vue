<template>
  <div class="map-container" ref="mapContainer" tabindex="0" aria-label="World map">
    <div v-if="isLoading" class="loading-screen" role="status" aria-live="polite" aria-busy="true">
      <h1 class="loading-title">Loading...</h1>
    </div>

    <div v-else class="all-maps-grid">
      <div v-for="(row, yIndex) in mapGrid" :key="yIndex" class="row">
        <div v-for="(tile, xIndex) in row" :key="xIndex" class="tile">
          <img v-if="tile" :src="getMapSkinUrl(tile.skin)" :alt="`Map tile: ${tile.name}`" />

          <FightButton
            v-if="tile?.content?.type === 'monster' && tile.x === currentPlayer?.x && tile.y === currentPlayer?.y"
            class="fight-button"
          />
          <GatherButton
            v-if="tile?.content?.type === 'resource' && tile.x === currentPlayer?.x && tile.y === currentPlayer?.y"
            :code="tile.content.code"
            class="gather-button"
          />
          <CraftButton
            v-if="tile?.content?.type === 'workshop' && tile.x === currentPlayer?.x && tile.y === currentPlayer?.y"
            class="craft-button"
          />

          <div
            v-if="tile && currentPlayer && tile.x === currentPlayer.x && tile.y === currentPlayer.y"
            class="player-wrapper"
          >
            <p class="player-name">{{ currentPlayer.name }}</p>
            <img :src="getPlayerSkinUrl(currentPlayer.skin)" alt="Player character" class="player" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="isMoving" class="cooldown-overlay">Moving...</div>
    <div v-if="!cd.canAct" class="cd-bar">
      <div class="cd-fill" :style="{ width: (cd.progress * 100) + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayer } from '../stores/usePlayer'
import { useMap } from '../stores/useMap'
import { useCooldown } from '../stores/useCooldown'
import GatherButton from '../components/GatherButton.vue'
import FightButton from '../components/FightButton.vue'
import CraftButton from '../components/CraftWorkshop.vue'

const emit = defineEmits<{ (e: 'ready'): void }>()
const cd = useCooldown()

const playerStore = usePlayer()
const { player } = storeToRefs(playerStore)
const { movePlayer } = playerStore
const { fetchCurrentMap } = useMap()

const mapContainer = ref<HTMLDivElement | null>(null)
const isMoving = ref(false)
const isLoading = ref(true)
const currentPlayer = computed(() => player.value ?? null)
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

function getMapSkinUrl(skin: string) {
  return `https://www.artifactsmmo.com/images/maps/${skin}.png`
}
function getPlayerSkinUrl(skin: string) {
  return `https://www.artifactsmmo.com/images/characters/${skin}.png`
}

async function fetchAllMaps(): Promise<MapTile[]> {
  const allMaps: MapTile[] = []
  let page = 1
  const pageSize = 50
  let hasMore = true
  while (hasMore) {
    const res = await fetch(`https://api.artifactsmmo.com/maps?page=${page}&size=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_ARTIFACT_TOKEN}`,
        Accept: 'application/json',
      },
    })
    const json = await res.json()
    allMaps.push(...json.data)
    hasMore = page < json.pages
    page++
  }
  return allMaps
}

async function buildGrid() {
  if (!currentPlayer.value) return
  isLoading.value = true
  const maps = await fetchAllMaps()

  const xValues = maps.map(m => m.x)
  const yValues = maps.map(m => m.y)
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
  isLoading.value = false
  emit('ready')
}

function centerCameraOnPlayer() {
  const p = currentPlayer.value
  const container = mapContainer.value
  if (!p || !container || !mapGrid.value.length) return

  const tileSize = 224
  const playerScreenX = (p.x - minX) * tileSize
  const playerScreenY = (p.y - minY) * tileSize

  requestAnimationFrame(() => {
    container.scrollTo({
      top: playerScreenY - container.clientHeight / 2 + tileSize / 2,
      left: playerScreenX - container.clientWidth / 2 + tileSize / 2,
      behavior: 'instant',
    })
  })
}

function maybeScrollIfNearEdge() {
  const p = currentPlayer.value
  const container = mapContainer.value
  if (!p || !container) return

  const tileSize = 224
  const visibleWidth = container.clientWidth
  const visibleHeight = container.clientHeight

  const playerScreenX = (p.x - minX) * tileSize
  const playerScreenY = (p.y - minY) * tileSize

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
    container.scrollTo({ top: newScrollY, left: newScrollX, behavior: 'smooth' })
  }
}

async function handleKeyPress(event: KeyboardEvent) {
  if (isMoving.value || !currentPlayer.value || !cd.canAct) return

  let newX = currentPlayer.value.x
  let newY = currentPlayer.value.y

  switch (event.key) {
    case 'ArrowUp':
    case 'z': newY -= 1; break
    case 'ArrowDown':
    case 's': newY += 1; break
    case 'ArrowLeft':
    case 'q': newX -= 1; break
    case 'ArrowRight':
    case 'd': newX += 1; break
    default: return
  }

  isMoving.value = true
  await movePlayer(newX, newY)
  maybeScrollIfNearEdge()
  isMoving.value = false
}

watch(() => currentPlayer.value?.name, async (n) => {
  if (n) await buildGrid()
}, { immediate: true })

watch(() => currentPlayer.value, (p) => {
  if (p) fetchCurrentMap(p.x, p.y)
}, { immediate: true })

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
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

.loading-screen {
  position: absolute;
  inset: 0;
  background-color: #1b3b1a;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-title {
  color: #ffe792;
  font-size: 2rem;
}

.all-maps-grid { display: flex; flex-direction: column; width: max-content; height: max-content; }
.row { display: flex; }
.tile { width: 224px; height: 224px; position: relative; }
.tile img { object-fit: cover; }

.gather-button, .fight-button, .craft-button {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.player-wrapper {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  text-align: center;
}
.player { width: 50%; height: auto; }
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
  background-color: #21381b;
  opacity: 0.9;
  color: #ffe792;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 9999;
}

.cd-bar{
  position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
  width:180px; height:12px;
  background:#0f1d0c; border:2px solid #2e5326; border-radius:999px;
  box-shadow:0 6px 18px #0007, inset 0 1px 2px #0005;
  overflow:hidden; z-index:9999;
}
.cd-fill{
  height:100%; width:0%;
  background:linear-gradient(90deg,#7be36f,#d9ff7a);
  box-shadow:inset 0 0 6px #0004;
  transition:width .2s linear;
}
</style>
