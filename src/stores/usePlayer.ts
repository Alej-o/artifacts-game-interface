import { defineStore } from 'pinia'
import { ref, watch } from 'vue'


interface MapContent {
  type: string
  code: string
}

interface MapData {
  name: string
  skin: string
  x: number
  y: number
  content: MapContent | null
}

export const usePlayer = defineStore('player', () => {
  const player = ref<null | {
    name: string
    level: number
    skin: string
    x: number
    y: number
  }>(null)

const currentMapName = ref<MapData | null>(null)

  const token = import.meta.env.VITE_ARTIFACT_TOKEN

  async function fetchPlayer() {
    try {
      const res = await fetch('https://api.artifactsmmo.com/my/characters', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      const json = await res.json()
      const char = json.data?.[0]

      if (char) {
        player.value = {
          ...char,
          x: char.x ?? 0,
          y: char.y ?? 0,
        }

        if (player.value) {
          await fetchCurrentMapName(player.value.x, player.value.y)
        }
      }
    } catch (error) {
      console.error('[Erreur fetchPlayer]', error)
    }
  }

  async function fetchCurrentMapName(x: number, y: number) {
    try {
      const res = await fetch(`https://api.artifactsmmo.com/maps/${x}/${y}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      const json = await res.json()
      currentMapName.value = json.data
    } catch (error) {
      console.error('Failed to fetch map name:', error)
    }
  }

  watch(player, (newPlayer) => {
    if (newPlayer) {
      fetchCurrentMapName(newPlayer.x, newPlayer.y)
    }
  })

  return {
    player,
    fetchPlayer,
    currentMapName,
  }
})
