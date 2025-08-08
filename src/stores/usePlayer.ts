import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMap } from './useMap'
import type { Player } from '../types/Player'
import { useCooldown } from './useCooldown'

type MoveApiResponse = {
  data?: {
    cooldown?: {
      total_seconds: number
      remaining_seconds: number
      started_at: string
      expiration: string
      reason: string
    }
    destination?: { name: string; skin: string; x: number; y: number; content: any }
    character?: Player
  }
}

export const usePlayer = defineStore('player', () => {
  const player = ref<null | Player>(null)
  const token = import.meta.env.VITE_ARTIFACT_TOKEN

  async function fetchPlayer() {
    try {
      const res = await fetch('https://api.artifactsmmo.com/my/characters', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
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
  async function movePlayer(newX: number, newY: number): Promise<MoveApiResponse | null> {
    if (!player.value) return null

    const cd = useCooldown()

    return await cd.guard(async () => {
      const res = await fetch(
        `https://api.artifactsmmo.com/my/${player.value!.name}/action/move`,
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

      const json: MoveApiResponse = await res.json()

      const movedChar = json.data?.character
      const destination = json.data?.destination

      if (movedChar) {
        if (!player.value) player.value = movedChar
        else Object.assign(player.value, movedChar)
      }
      if (destination) {
        const mapStore = useMap()
        mapStore.fetchCurrentMap(destination.x, destination.y)
        if (player.value) {
          player.value.x = destination.x
          player.value.y = destination.y
        }
      }

      return json
    })
  }

  function updatePlayer(updated: typeof player.value) {
    if (!updated) return
    if (!player.value) player.value = updated
    else Object.assign(player.value, updated)
  }

  async function equipItem(code: string, slot: string, quantity = 1) {
    if (!player.value) return
    const res = await fetch(`https://api.artifactsmmo.com/my/${player.value.name}/action/equip`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ code, slot, quantity }),
    })
    const json = await res.json()
    if (json.data?.character) updatePlayer(json.data.character)
  }

  async function unequipItem(slot: string, quantity = 1) {
    if (!player.value) return
    const res = await fetch(`https://api.artifactsmmo.com/my/${player.value.name}/action/unequip`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ slot, quantity }),
    })
    const json = await res.json()
    if (json.data?.character) updatePlayer(json.data.character)
  }

  return { player, fetchPlayer, movePlayer, updatePlayer, equipItem, unequipItem }
})
