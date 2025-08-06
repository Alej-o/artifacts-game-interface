<template>
  <div v-if="isWorkshop">
    <button class="craft-btn" @click="openModal">🛠️ Craft</button>
    <transition name="slide-modal">
      <div v-if="open" class="craft-modal-overlay" @click.self="closeModal">
        <div class="craft-center-container">
          <CraftList
            :crafts="crafts"
            :workshop-label="workshopLabel"
            @close="closeModal"
            @select="selectItem"
          />
          <transition name="fade-modal">
            <ItemDetailModal
              v-if="detailsOpen && selectedItem"
              :selected-item="selectedItem"
              :loading-detail="loadingDetail"
              :crafting-id="craftingId"
              :get-item-icon="getItemIcon"
              :get-item-name="getItemName"
              :has-enough="hasEnough"
              :can-craft="canCraft"
              :player-quantity="playerQuantity"
              :format-effect-label="formatEffectLabel"
              :format-effect-value="formatEffectValue"
              @closeDetails="closeDetails"
              @craft="craft"
            />
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMap } from '../stores/useMap'
import { usePlayer } from '../stores/usePlayer'
import { storeToRefs } from 'pinia'
import CraftList from './CraftList.vue'
import ItemDetailModal from '../components/modals/ItemDetailModal.vue'

const mapStore = useMap()
const playerStore = usePlayer()
const { currentMap } = storeToRefs(mapStore)
const { player } = storeToRefs(playerStore)

const open = ref(false)
const loading = ref(false)
const error = ref('')
const crafts = ref<any[]>([])
const selectedItem = ref<any | null>(null)
const loadingDetail = ref(false)
const craftingId = ref<string | null>(null)
const detailsOpen = ref(false)

const isWorkshop = computed(() =>
  currentMap.value?.content?.type === 'workshop' && !!skillParam.value
)
const shopCode = computed(() => currentMap.value?.content?.code ?? null)
const skillParam = computed(() => {
  if (!shopCode.value) return null
  if (shopCode.value === 'jewelry') return 'jewelrycrafting'
  if (shopCode.value === 'forge') return 'weaponcrafting'
  return shopCode.value
})
const workshopLabel = computed(() => {
  if (!shopCode.value) return 'Atelier'
  if (shopCode.value === 'forge') return 'Forge'
  if (shopCode.value === 'jewelry') return 'Atelier de joaillerie'
  return shopCode.value.charAt(0).toUpperCase() + shopCode.value.slice(1)
})

function getItemName(code: string) {
  return code.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
}
function getItemIcon(code: string) {
  return `https://www.artifactsmmo.com/images/items/${code}.png`
}
function playerQuantity(code: string) {
  if (!player.value?.inventory) return 0
  const found = player.value.inventory.find(i => i.code === code)
  return found ? found.quantity : 0
}
function hasEnough(code: string, need: number) {
  return playerQuantity(code) >= need
}
function canCraft(item: any) {
  if (!item?.craftItems) return false
  return item.craftItems.every((need: any) => hasEnough(need.code, need.value))
}
function formatEffectLabel(effect: any): string {
  if (!effect?.code) return ''
  return effect.code
    .replace(/^dmg_/, 'Damage ')
    .replace(/^res_/, 'Res ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase())
}
function formatEffectValue(effect: any): string {
  if (typeof effect.value === 'number') {
    if (effect.description && effect.description.match(/%/)) return effect.value + '%'
    if (/^(dmg_|res_)/.test(effect.code)) return effect.value + '%'
    return effect.value.toString()
  }
  return effect.value || ''
}
function closeModal() {
  open.value = false
  crafts.value = []
  selectedItem.value = null
  error.value = ''
  loading.value = false
  loadingDetail.value = false
  detailsOpen.value = false
}
function closeDetails() {
  detailsOpen.value = false
}
async function openModal() {
  open.value = true
  loading.value = true
  error.value = ''
  crafts.value = []
  selectedItem.value = null
  try {
    const token = import.meta.env.VITE_ARTIFACT_TOKEN
    const res = await fetch(
      `https://api.artifactsmmo.com/items?craft_skill=${skillParam.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    crafts.value = (json.data ?? []).map((item: any) => ({
      code: item.code,
      name: item.name || item.code,
      icon: item.icon || getItemIcon(item.code),
      level: item.level || 1
    }))
  } catch (e: any) {
    error.value = 'Failed to fetch crafts'
  } finally {
    loading.value = false
  }
}
async function selectItem(code: string) {
  if (!detailsOpen.value) detailsOpen.value = true
  loadingDetail.value = true

  try {
    const token = import.meta.env.VITE_ARTIFACT_TOKEN
    const res = await fetch(
      `https://api.artifactsmmo.com/items/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    selectedItem.value = {
      ...json.data,
      icon: json.data.icon || getItemIcon(json.data.code),
      craftItems: Array.isArray(json.data.craft?.items)
        ? json.data.craft.items.map((need: any) => ({
            code: need.code,
            value: need.quantity
          }))
        : []
    }
  } catch (e: any) {
    error.value = 'Failed to fetch item details'
    selectedItem.value = null
  } finally {
    loadingDetail.value = false
  }
}
async function craft(item: any) {
  if (!player.value?.name) return
  craftingId.value = item.code
  try {
    const token = import.meta.env.VITE_ARTIFACT_TOKEN
    const res = await fetch(
      `https://api.artifactsmmo.com/my/${player.value.name}/action/crafting`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({ code: item.code, quantity: 1 })
      }
    )
    if (!res.ok) throw new Error('Craft failed')
    alert('Item crafted ! (à brancher proprement)')
  } catch (e: any) {
    alert('Error while crafting this item.')
  } finally {
    craftingId.value = null
  }
}
function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (detailsOpen.value) closeDetails()
    else closeModal()
  }
}
onMounted(() => window.addEventListener('keydown', onEsc))
onUnmounted(() => window.removeEventListener('keydown', onEsc))
</script>

<style scoped>
.craft-btn {
  background: #246b35;
  color: #ffe792;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  padding: 6px 19px;
  margin-top: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px #0003;
  transition: background 0.13s;
}
.craft-btn:hover { background: #339c53; }
.craft-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  background: rgba(16,24,16,0.84);
  display: flex;
  align-items: center;
  justify-content: center;
}
.craft-center-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  min-height: 70vh;
  z-index: 2;
  position: relative;
}
.fade-modal-enter-active,
.fade-modal-leave-active { transition: opacity 0.18s; }
.fade-modal-enter-from,
.fade-modal-leave-to { opacity: 0; }
</style>
