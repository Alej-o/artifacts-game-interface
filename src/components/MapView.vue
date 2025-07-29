<template>
  <div ref="mapContainer" class="map-container">
    <div class="all-maps-grid">
      <div v-for="(row, yIndex) in mapGrid" :key="yIndex" class="row">
        <div v-for="(tile, xIndex) in row" :key="xIndex" class="tile">
          <img v-if="tile" :src="getSkinUrl(tile.skin)" :alt="tile.name" />
          <div
            v-if="tile && player && tile.x === player.x && tile.y === player.y"
            class="player-wrapper"
          >
            <p class="player-name">{{ player.name }}</p>
            <img :src="getPlayerSkinUrl(player.skin)" alt="Player" class="player" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { usePlayer } from '../stores/usePlayer'

const { player } = usePlayer()
const mapContainer = ref<HTMLDivElement | null>(null)

interface MapTile {
  name: string
  skin: string
  x: number
  y: number
  content: any
}

const token = import.meta.env.VITE_ARTIFACT_TOKEN
const mapGrid = ref<(MapTile | null)[][]>([])

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
          Authorization: `Bearer ${token}`,
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
  const maps = await fetchAllMaps()

  const xValues = maps.map((m) => m.x)
  const yValues = maps.map((m) => m.y)
  const minX = Math.min(...xValues)
  const minY = Math.min(...yValues)

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

  if (mapContainer.value && player) {
    const scrollX = (player.x - minX) * 224 - mapContainer.value.clientWidth / 4 + 112
    const scrollY = (player.y - minY) * 224 - mapContainer.value.clientHeight / 4 + 112

    mapContainer.value.scrollTo({
      top: scrollY,
      left: scrollX,
      behavior: 'instant', 
    })
  }
}

onMounted(() => {
  buildGrid()
})
</script>

<style scoped>

.map-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  
}

.all-maps-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: max-content;
  height: max-content;
}

.row {
  display: flex;
  gap: 1px;
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
  bottom: 0;
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
</style>
