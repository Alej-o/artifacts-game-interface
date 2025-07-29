<template>
  <form @submit.prevent="submitToken">
    <label for="token">Token d'accès :</label>
    <input
      id="token"
      v-model="token"
      type="text"
      placeholder="Entrez votre token..."
    />
    <button type="submit">Valider</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const token = ref('')
const emit = defineEmits<{
  (e: 'token-submitted', value: string): void
}>()

function submitToken() {
  if (token.value.trim() !== '') {
    emit('token-submitted', token.value)
    token.value = ''
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 300px;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  padding: 0.5rem;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
