
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMap = defineStore('map', () => {
  const currentMap = ref<null | {
    name: string
    skin: string
    x: number
    y: number
    content: null | {
      type: string
      code: string
    }
  }>(null)

  const token = import.meta.env.VITE_ARTIFACT_TOKEN

  async function fetchCurrentMap(x: number, y: number) {
    try {
      const res = await fetch(`https://api.artifactsmmo.com/maps/${x}/${y}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      const json = await res.json()
      currentMap.value = json.data
    } catch (error) {
      console.error('[Erreur fetchCurrentMap]', error)
    }
  }

  return { currentMap, fetchCurrentMap }
})
