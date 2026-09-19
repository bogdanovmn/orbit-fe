<template>
  <div class="tracks-page">
    <h1 class="page-title">Треки (GPX)</h1>

    <div class="toolbar">
      <div class="upload-box">
        <input
          ref="fileInput"
          type="file"
          accept=".gpx,.xml"
          :disabled="tracks.isUploading"
          @change="onFileSelected"
        />
        <button
          class="btn btn-primary"
          :disabled="!selectedFile || tracks.isUploading"
          @click="handleUpload"
        >
          {{ tracks.isUploading ? 'Загрузка...' : 'Загрузить' }}
        </button>
        <span v-if="uploadError" class="error-text">{{ uploadError }}</span>
      </div>
    </div>

    <div v-if="tracks.isLoading" class="loading">Загрузка...</div>

    <div v-else-if="tracks.tracks.length === 0" class="empty">
      Пока нет ни одного трека. Загрузите GPX-файл.
    </div>

    <div v-else class="data-list">
      <div
        v-for="track in tracks.tracks"
        :key="track.id"
        class="data-row"
        @click="router.push(`/tracks/${track.id}`)"
      >
        <div>
          <div class="data-title">{{ track.trackName || track.fileName }}</div>
          <div class="data-sub">
            {{ formatDateTime(track.startTime) }}
            <span v-if="track.startTime"> · </span>
            {{ formatKm(track.distanceM) }}
            <span v-if="track.durationSec != null"> · {{ formatSeconds(track.durationSec) }}</span>
          </div>
        </div>
        <div class="data-actions">
          <button
            class="icon-btn"
            title="Удалить"
            aria-label="Удалить"
            :disabled="tracks.isDeleting.has(track.id)"
            @click.stop="handleDelete(track)"
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
import { tracksStore } from '@/stores/tracks'
import type { GpxBrief } from '@/api'
import { formatDateTime, formatKm, formatSeconds } from '@/utils/format'

const router = useRouter()
const tracks = tracksStore()

const selectedFile = ref<File | null>(null)
const uploadError = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  tracks.load()
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
    await tracks.upload(selectedFile.value)
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Не удалось загрузить файл'
  }
}

async function handleDelete(track: GpxBrief) {
  if (!window.confirm(`Удалить трек «${track.trackName || track.fileName}»?`)) return
  try {
    await tracks.remove(track.id)
  } catch {
    alert('Не удалось удалить')
  }
}
</script>