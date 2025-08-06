<template>
  <transition-group name="toast" tag="div" class="toast-group">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast-message"
      :class="toast.type"
      role="alert"
      aria-live="assertive"
    >
      {{ toast.text }}
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Toast {
  id: number
  text: string
  type: 'success' | 'error' | 'info' | 'loot'
}

const toasts = ref<Toast[]>([])

function addToast(text: string, type: Toast['type'] = 'info', duration = 2500) {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, text, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}


defineExpose({ addToast })
</script>

<style scoped>
.toast-group {
  position: fixed;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}
.toast-message {
  min-width: 190px;
  margin-bottom: 9px;
  padding: 13px 27px;
  border-radius: 13px;
  font-size: 16px;
  font-weight: 600;
  color: #fafffa;
  background: #22361ae8;
  border: 2px solid #cdfae4;
  box-shadow: 0 8px 32px #0008;
  text-align: center;
  opacity: 1;
  pointer-events: auto;
  animation: fadeInOut .35s cubic-bezier(.44,.11,.62,.89);
}
.toast-message.success { border-color: #90e992; background: #2b4326eb; color: #ecffe9; }
.toast-message.error { border-color: #fa9090; background: #502a2aeb; color: #fff0f0; }
.toast-message.info { border-color: #c1dbfa; background: #223850e9; color: #e5efff; }
.toast-message.loot { border-color: #fcdb8c; background: #41360b; color: #fff3c1; }
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-20px);}
  12% { opacity: 1; transform: translateY(0);}
  88% { opacity: 1;}
  100% { opacity: 0; transform: translateY(10px);}
}

.toast-enter-active, .toast-leave-active { transition: opacity .22s, transform .24s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-22px);}
</style>
