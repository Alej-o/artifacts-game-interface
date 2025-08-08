import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'

export const useCooldown = defineStore('cooldown', () => {
  const expiresAt = ref<number | null>(null)
  const durationSec = ref(0)
  const now = ref(Date.now())
  let timer: any = null

  const remaining = computed(() => {
    if (!expiresAt.value) return 0
    const s = Math.ceil((expiresAt.value - now.value) / 1000)
    return Math.max(0, s)
  })

  const canAct = computed(() => remaining.value === 0)

  const progress = computed(() => {
    if (!expiresAt.value || durationSec.value <= 0) return 1
    const elapsed = durationSec.value - remaining.value
    return Math.min(1, Math.max(0, elapsed / durationSec.value))
  })

  function _startTick() {
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      now.value = Date.now()
      if (remaining.value <= 0) {
        clearInterval(timer)
        timer = null
        expiresAt.value = null
        durationSec.value = 0
        localStorage.removeItem('cooldown_expires_at')
        localStorage.removeItem('cooldown_duration')
      }
    }, 100) 
  }

  function startCooldown(seconds: number, expirationIso?: string) {
    durationSec.value = Math.max(0, seconds)
    const until = expirationIso
      ? new Date(expirationIso).getTime()
      : Date.now() + seconds * 1000
    expiresAt.value = until
    localStorage.setItem('cooldown_expires_at', String(until))
    localStorage.setItem('cooldown_duration', String(durationSec.value))
    _startTick()
  }



async function guard<T>(fn: () => Promise<T>): Promise<T | null> {
  if (!canAct.value) return null
  const res = await fn()
  const cd = (res as any)?.data?.cooldown ?? (res as any)?.cooldown
  if (cd) {

    const seconds =
      (cd.total_seconds && cd.total_seconds > 0) ? cd.total_seconds
      : (cd.remaining_seconds ?? 0)

    startCooldown(seconds, cd.expiration)
  }
  return res
}


  const savedUntil = localStorage.getItem('cooldown_expires_at')
  const savedDur = localStorage.getItem('cooldown_duration')
  if (savedUntil) {
    const until = Number(savedUntil)
    if (!Number.isNaN(until) && until > Date.now()) {
      expiresAt.value = until
      durationSec.value = Math.max(0, Number(savedDur) || 0)
      _startTick()
    } else {
      localStorage.removeItem('cooldown_expires_at')
      localStorage.removeItem('cooldown_duration')
    }
  }

  onUnmounted(() => { if (timer) clearInterval(timer) })

  return { remaining, canAct, progress, startCooldown, guard }
})
