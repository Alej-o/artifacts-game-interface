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
    hp: number
    max_hp: number
    xp: number
    max_xp: number
    gold: number
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
        if (!player.value) {
          player.value = {
            name: char.name,
            level: char.level,
            skin: char.skin,
            x: char.x ?? 0,
            y: char.y ?? 0,
            hp: char.hp,
            max_hp: char.max_hp,
            xp: char.xp,
            max_xp: char.max_xp,
            gold: char.gold
          }
        } else {
          Object.assign(player.value, {
            name: char.name,
            level: char.level,
            skin: char.skin,
            x: char.x ?? 0,
            y: char.y ?? 0,
            hp: char.hp,
            max_hp: char.max_hp,
            xp: char.xp,
            max_xp: char.max_xp,
            gold: char.gold
          })
        }

        const mapStore = useMap()
        mapStore.fetchCurrentMap(player.value.x, player.value.y)
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
