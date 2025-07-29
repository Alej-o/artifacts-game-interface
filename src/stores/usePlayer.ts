import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMap } from './useMap'

export const usePlayer = defineStore('player', () => {
  const player = ref<null | {
    name: string
    level: number
    skin: string
    x: number
    y: number
  }>(null)

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

        const mapStore = useMap()
        if (player.value) {
          mapStore.fetchCurrentMap(player.value.x, player.value.y)
        }
      }
    } catch (error) {
      console.error('[Erreur fetchPlayer]', error)
    }
  }

  async function movePlayer(newX: number, newY: number): Promise<number | null> {
    if (!player.value) return null

    try {
      const res = await fetch(
        `https://api.artifactsmmo.com/my/${player.value.name}/action/move`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ x: newX, y: newY }),
        }
      )

      const json = await res.json()
      const movedChar = json.data?.character
      const destination = json.data?.destination
      const cooldown = json.data?.cooldown?.remaining_seconds ?? null

      if (player.value && movedChar && destination) {
        player.value.x = destination.x
        player.value.y = destination.y
        player.value.level = movedChar.level
        player.value.skin = movedChar.skin
        player.value.name = movedChar.name 
      }

      const mapStore = useMap()
      mapStore.fetchCurrentMap(destination.x, destination.y)

      return cooldown
    } catch (error) {
      console.error('[Erreur movePlayer]', error)
      return null
    }
  }

  return {
    player,
    fetchPlayer,
    movePlayer,
  }
})
