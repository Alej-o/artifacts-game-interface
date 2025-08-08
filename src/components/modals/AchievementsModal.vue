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
          No achievements found.
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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-achievements {
  background: #21381b;
  border: 3px solid #43633e;
  color: #e7ffd6;
  border-radius: 15px;
  min-width: 450px;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 4px 40px #000b, 0 1px 0 #3c3e2c;
  padding: 24px 26px 18px 26px;
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
  font-size: 22px;
  letter-spacing: .04em;
  font-weight: bold;
  color: #ffe792;
  padding-bottom: 1px;
}
.close-btn {
  background: #284a31;
  border: none;
  color: #ffe792;
  font-size: 22px;
  cursor: pointer;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-left: 10px;
  margin-top: -3px;
  opacity: 0.82;
  box-shadow: 0 2px 8px #0004;
  transition: background .13s, opacity .15s;
  font-weight: bold;
}
.close-btn:hover { background: #3cb162; opacity: 1; }

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.tabs button {
  background: #1a2812;
  color: #ffe792;
  padding: 6px 18px;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  cursor: pointer;
  letter-spacing: .03em;
  font-weight: bold;
  box-shadow: 0 1px 3px #0003;
  transition: background .13s, color .13s;
  border: 2px solid transparent;
}
.tabs button.active,
.tabs button:hover {
  background: #70e088;
  color: #183016;
  border: 2px solid #b7f183;
}

.achievements-list {
  flex: 1 1 auto;
  overflow-y: auto;
  max-height: 55vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 10px;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.achievement-card {
  background: #223822;
  border-radius: 8px;
  padding: 10px 12px 10px 19px;
  position: relative;
  font-size: 14px;
  color: #e7ffd6;
  box-shadow: 0 2px 6px #0005;
}
.achievement-card.completed {
  border-color: #9eff7b;
  background: #e5ece3ff;
  opacity: 1;
}
.ach-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 15px;
  color: #ffe792;
  font-weight: bold;
}
.ach-completed {
  color: #9eff7b;
  font-size: 19px;
  margin-left: 4px;
  font-weight: bold;
}
.ach-desc {
  font-size: 13px;
  color: #fffac0;
  margin-bottom: 5px;
  margin-top: 2px;
  font-family: 'VT323', 'Press Start 2P', monospace;
}
.ach-progress {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 4px;
  font-size: 13px;
  color: #3cb162;
}
.progress-bar-bg {
  flex: 1;
  height: 10px;
  border-radius: 7px;
  background: #232c28;
  box-shadow: 0 1px 2px #0004 inset;
  overflow: hidden;
  margin-left: 10px;
}
.progress-bar-fg {
  height: 100%;
  background: linear-gradient(90deg, #9eff7b 60%, #ffe792 100%);
  border-radius: 7px 0 0 7px;
  transition: width .18s;
}
.ach-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 7px;
  font-size: 13px;
}
.ach-points {
  color: #fce398;
  font-weight: bold;
  font-size: 14px;
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


</style>
