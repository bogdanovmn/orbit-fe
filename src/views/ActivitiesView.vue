<template>
  <div class="activities-page">
    <h1 class="page-title">Тренировки (FIT)</h1>

    <div class="toolbar">
      <div class="upload-box">
        <input
          ref="fileInput"
          type="file"
          accept=".fit"
          :disabled="activities.isUploading"
          @change="onFileSelected"
        />
        <button
          class="btn btn-primary"
          :disabled="!selectedFile || activities.isUploading"
          @click="handleUpload"
        >
          {{ activities.isUploading ? 'Загрузка...' : 'Загрузить' }}
        </button>
        <span v-if="uploadError" class="error-text">{{ uploadError }}</span>
      </div>
    </div>

    <div v-if="activities.isLoading" class="loading">Загрузка...</div>

    <div v-else-if="activities.activities.length === 0" class="empty">
      Пока нет ни одной тренировки. Загрузите FIT-файл.
    </div>

    <div v-else class="data-list">
      <div
        v-for="activity in activities.activities"
        :key="activity.id"
        class="data-row"
        @click="router.push(`/activities/${activity.id}`)"
      >
        <div>
          <div class="data-title">{{ activity.fileName }}</div>
          <div class="data-sub">
            {{ [activity.sport, activity.subSport].filter(Boolean).join(' / ') || 'Тренировка' }}
            <span v-if="activity.startTime"> · {{ formatDateTime(activity.startTime) }}</span>
            <span v-if="activity.distanceM != null"> · {{ formatKm(activity.distanceM) }}</span>
            <span v-if="activity.totalElapsedSec != null"> · {{ formatSeconds(activity.totalElapsedSec) }}</span>
          </div>
        </div>
        <div class="data-actions">
          <button
            class="icon-btn"
            title="Удалить"
            aria-label="Удалить"
            :disabled="activities.isDeleting.has(activity.id)"
            @click.stop="handleDelete(activity)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { activitiesStore } from '@/stores/activities'
import type { FitBrief } from '@/api'
import { formatDateTime, formatKm, formatSeconds } from '@/utils/format'

const router = useRouter()
const activities = activitiesStore()

const selectedFile = ref<File | null>(null)
const uploadError = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  activities.load()
})

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
  uploadError.value = null
}

async function handleUpload() {
  if (!selectedFile.value) return
  uploadError.value = null
  try {
    await activities.upload(selectedFile.value)
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Не удалось загрузить файл'
  }
}

async function handleDelete(activity: FitBrief) {
  if (!window.confirm(`Удалить тренировку «${activity.fileName}»?`)) return
  try {
    await activities.remove(activity.id)
  } catch {
    alert('Не удалось удалить')
  }
}
</script>