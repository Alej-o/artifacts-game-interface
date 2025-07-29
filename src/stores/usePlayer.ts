import { defineStore } from 'pinia'
import { ref } from 'vue'

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
      }
    } catch (error) {
      console.error('[Erreur fetchPlayer]', error)
    }
  }

  return {
    player,
    fetchPlayer,
  }
})
