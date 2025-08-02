import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMap } from './useMap'
import type { Player } from '../types/Player'

export const usePlayer = defineStore('player', () => {
const player = ref<null | Player>(null)

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
    const char = json.data?.[0] as Player | undefined

    if (char) {
      player.value = char
      const mapStore = useMap()
      mapStore.fetchCurrentMap(char.x, char.y)
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
        Object.assign(player.value, {
          x: destination.x,
          y: destination.y,
          level: movedChar.level,
          skin: movedChar.skin,
          name: movedChar.name
        })
      }

      const mapStore = useMap()
      mapStore.fetchCurrentMap(destination.x, destination.y)

      return cooldown
    } catch (error) {
      console.error('[Erreur movePlayer]', error)
      return null
    }
  }

  function updatePlayer(updated: typeof player.value) {
    if (!updated) return
    if (!player.value) {
      player.value = updated
    } else {
      Object.assign(player.value, updated)
    }
  }

  return {
    player,
    fetchPlayer,
    movePlayer,
    updatePlayer
  }
})
