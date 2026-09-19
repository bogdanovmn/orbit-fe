<template>
  <button class="icon-btn" aria-label="Назад" title="Назад" @click="goBack">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{ fallback: string }>()
const router = useRouter()

function goBack() {
  const state = window.history.state as { back?: string } | null
  if (state?.back) {
    router.back()
  } else {
    router.push(props.fallback)
  }
}
</script>