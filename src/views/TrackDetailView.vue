<template>
  <div class="track-detail">
    <div v-if="tracks.isLoading" class="loading">Загрузка...</div>

    <template v-else-if="track">
      <div class="heading-row">
        <BackButton fallback="/tracks" />
        <h1 class="page-title">{{ track.trackName || track.fileName }}</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Дистанция</div>
          <div class="stat-value">{{ formatKm(track.distanceM) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Продолжительность</div>
          <div class="stat-value">{{ formatSeconds(track.durationSec) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Набор высоты</div>
          <div class="stat-value">{{ track.ascentM.toFixed(0) }} м</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Спуск</div>
          <div class="stat-value">{{ track.descentM.toFixed(0) }} м</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Точек</div>
          <div class="stat-value">{{ track.pointsCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Начало</div>
          <div class="stat-value">{{ formatDateTime(track.startTime) }}</div>
        </div>
      </div>

      <div class="toolbar">
        <button
          class="btn"
          :class="{ 'btn-primary': selectedTransport === GpxTransport.Auto }"
          @click="switchTransport(GpxTransport.Auto)"
        >
          Автомобиль
        </button>
        <button
          class="btn"
          :class="{ 'btn-primary': selectedTransport === GpxTransport.Pedestrian }"
          @click="switchTransport(GpxTransport.Pedestrian)"
        >
          Пешком
        </button>
        <a
          v-if="track.yandexMapUrl"
          class="btn btn-primary"
          :href="track.yandexMapUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть на Яндекс.Картах
        </a>
      </div>

      <div v-if="!track.yandexMapUrl" class="empty">
        Маршрут недоступен: в файле нет точек.
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BackButton from '@/components/BackButton.vue'
import { tracksStore } from '@/stores/tracks'
import { GpxTransport } from '@/api'
import { formatDateTime, formatKm, formatSeconds } from '@/utils/format'

const props = defineProps<{ id: string }>()

const tracks = tracksStore()
const selectedTransport = ref<GpxTransport>(GpxTransport.Auto)

const track = computed(() => tracks.currentTrack)

function switchTransport(transport: GpxTransport) {
  selectedTransport.value = transport
  tracks.loadDetail(props.id, transport)
}

onMounted(() => {
  if (tracks.currentTrack?.id !== props.id) {
    tracks.loadDetail(props.id, selectedTransport.value)
  }
})

watch(() => props.id, (id) => {
  selectedTransport.value = GpxTransport.Auto
  tracks.loadDetail(id, selectedTransport.value)
})
</script>

<style scoped>
.heading-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>