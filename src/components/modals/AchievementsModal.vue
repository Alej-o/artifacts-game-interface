<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-achievements">
      <div class="achievements-header">
        <span class="achievements-title">ACHIEVEMENTS</span>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="{active: activeTab === tab.value}"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" style="padding: 24px; text-align: center;">Chargement…</div>
      <div v-else-if="error" style="padding: 18px; color: #f77;">{{ error }}</div>
      <div v-else class="achievements-list">
        <div
          v-for="ach in filteredAchievements"
          :key="ach.code"
          class="achievement-card"
          :class="{completed: ach.completed_at}"
        >
          <div class="ach-main">
            <div class="ach-header">
              <strong>{{ ach.name }}</strong>
              <span v-if="ach.completed_at" class="ach-completed">✔</span>
            </div>
            <div class="ach-desc">{{ ach.description }}</div>
            <div class="ach-progress">
              <span>{{ ach.current ?? 0 }}/{{ ach.total }}</span>
              <div class="progress-bar-bg">
                <div
                  class="progress-bar-fg"
                  :style="{ width: progressPercent(ach) + '%' }"
                ></div>
              </div>
            </div>
            <div class="ach-footer">
              <span class="ach-points">{{ ach.points }} point{{ ach.points > 1 ? 's' : '' }}</span>
              <span class="ach-rewards" v-if="ach.rewards?.gold">
                {{ ach.rewards.gold }} gold
              </span>
            </div>
          </div>
        </div>
        <div v-if="filteredAchievements.length === 0" style="padding: 18px; text-align: center; color: #ccc;">
          Aucun achievement trouvé.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps<{ account: string }>()
defineEmits<{ (e: 'close'): void }>()

const achievements = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const tabs = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Combat", value: "combat_kill" },
  { label: "Gathering", value: "gathering" },
  { label: "Crafting", value: "crafting" },
  { label: "Tasks", value: "task" },
  { label: "Recycling", value: "recycling" },
  { label: "Use", value: "use" },
]
const activeTab = ref("all")

onMounted(fetchAchievements)
watch(() => props.account, fetchAchievements)

async function fetchAchievements() {
  if (!props.account) return
  loading.value = true
  error.value = null
  try {
    const res = await fetch(
      `https://api.artifactsmmo.com/accounts/${props.account}/achievements`,
      { headers: { Accept: 'application/json' } }
    )
    const json = await res.json()
    achievements.value = json.data
  } catch (e) {
    error.value = "Failed to fetch achievements."
  }
  loading.value = false
}

const filteredAchievements = computed(() => {
  if (activeTab.value === "all") return achievements.value
  if (activeTab.value === "completed") return achievements.value.filter(a => a.completed_at)
  return achievements.value.filter(a => a.type === activeTab.value)
})

function progressPercent(ach: any) {
  if (!ach.total) return 0
  return Math.min(100, Math.floor((ach.current ?? 0) / ach.total * 100))
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-achievements {
  background: #121b15;
  border: 3px solid #344634;
  color: #fff;
  border-radius: 13px;
  min-width: 450px;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 4px 40px #000a;
  font-family: 'Press Start 2P', 'VT323', monospace, Arial, sans-serif;
  padding: 22px 24px 16px 24px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.achievements-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}
.achievements-title {
  font-size: 24px;
  letter-spacing: 1px;
  font-weight: bold;
  text-shadow: 1px 1px 0 #344634;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  font-family: inherit;
  cursor: pointer;
  margin-left: 8px;
  margin-top: -6px;
  opacity: 0.73;
  transition: opacity .15s;
}
.close-btn:hover { opacity: 1; }

.tabs {
  display: flex;
  gap: 9px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.tabs button {
  font-family: inherit;
  background: #18271e;
  color: #f8f8f8;
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  letter-spacing: 1px;
  font-weight: bold;
  transition: background .13s;
}
.tabs button.active,
.tabs button:hover {
  background: #70e088;
  color: #151e16;
}

.achievements-list {
  flex: 1 1 auto;
  overflow-y: auto;
  max-height: 55vh;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.achievement-card {
  background: #181f18;
  border: 2.5px solid #344634;
  border-radius: 7px;
  box-shadow: 0 1px 7px #0004;
  padding: 14px 15px 9px 14px;
  margin-bottom: 3px;
  transition: background .14s, border .14s;
  position: relative;
}
.achievement-card.completed {
  border-color: #9eff7b;
  background: #152b1b;
  opacity: 0.85;
}
.ach-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 4px;
  font-size: 15px;
}
.ach-desc {
  font-size: 13px;
  color: #e7ecd8;
  margin-bottom: 5px;
  margin-top: 2px;
}
.ach-progress {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 3px;
  font-size: 13px;
}
.progress-bar-bg {
  flex: 1;
  height: 8px;
  border-radius: 7px;
  background: #232a23;
  box-shadow: 0 1px 2px #0003 inset;
  overflow: hidden;
  margin-left: 8px;
}
.progress-bar-fg {
  height: 100%;
  background: linear-gradient(90deg, #9eff7b 60%, #e7e9a7 100%);
  border-radius: 7px 0 0 7px;
  transition: width .18s;
}
.ach-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 5px;
  font-size: 13px;
}
.ach-points {
  color: #fce398;
  font-weight: bold;
}
.ach-rewards {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ffe792;
  font-size: 13px;
}
.gold-icon {
  width: 20px;
  height: 20px;
  margin-right: 2px;
  filter: drop-shadow(0 1px 0 #8f7c47);
  image-rendering: pixelated;
}
.ach-completed {
  color: #9eff7b;
  font-size: 17px;
  margin-left: 4px;
  font-weight: bold;
}
</style>
