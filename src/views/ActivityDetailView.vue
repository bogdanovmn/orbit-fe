<template>
  <div class="activity-detail">
    <div v-if="activities.isLoading" class="loading">Загрузка...</div>

    <template v-else-if="activities.currentActivity">
      <div class="heading-row">
        <BackButton fallback="/activities" />
        <h1 class="page-title">{{ activities.currentActivity.fileName }}</h1>
        <span v-if="activities.currentActivity.sport || activities.currentActivity.subSport" class="sport-type">
          {{ [activities.currentActivity.sport, activities.currentActivity.subSport].filter(Boolean).join(' / ') }}
        </span>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Дистанция</div>
          <div class="stat-value">{{ formatKm(activities.currentActivity.distanceM) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Время (в движении)</div>
          <div class="stat-value">{{ formatSeconds(activities.currentActivity.totalTimerSec) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Средний пульс</div>
          <div class="stat-value">{{ activities.currentActivity.avgHeartRate ?? '—' }} <span class="unit">уд/мин</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Макс. пульс</div>
          <div class="stat-value">{{ activities.currentActivity.maxHeartRate ?? '—' }} <span class="unit">уд/мин</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Средняя скорость</div>
          <div class="stat-value">{{ speed(activities.currentActivity.avgSpeedKmh) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Макс. скорость</div>
          <div class="stat-value">{{ speed(activities.currentActivity.maxSpeedKmh) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Набор высоты</div>
          <div class="stat-value">{{ activities.currentActivity.totalAscentM ?? '—' }} <span class="unit">м</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Спуск</div>
          <div class="stat-value">{{ activities.currentActivity.totalDescentM ?? '—' }} <span class="unit">м</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Калории</div>
          <div class="stat-value">{{ activities.currentActivity.calories ?? '—' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Начало</div>
          <div class="stat-value">{{ formatDateTime(activities.currentActivity.startTime) }}</div>
        </div>
      </div>

      <h2 class="section-title">Пульс</h2>
      <SeriesChart :series="activities.currentActivity.series" />

      <h2 v-if="activities.currentActivity.laps.length > 0" class="section-title">Круги ({{ activities.currentActivity.laps.length }})</h2>
      <div v-if="activities.currentActivity.laps.length > 0" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Время</th>
              <th>Дистанция</th>
              <th>Средний пульс</th>
              <th>Макс. пульс</th>
              <th>Средняя скорость</th>
              <th>Калории</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lap, index) in activities.currentActivity.laps" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ formatSeconds(lap.elapsedSec) }}</td>
              <td>{{ formatKm(lap.distanceM) }}</td>
              <td>{{ lap.avgHeartRate ?? '—' }}</td>
              <td>{{ lap.maxHeartRate ?? '—' }}</td>
              <td>{{ speed(lap.avgSpeedKmh) }}</td>
              <td>{{ lap.calories ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BackButton from '@/components/BackButton.vue'
import SeriesChart from '@/components/SeriesChart.vue'
import { activitiesStore } from '@/stores/activities'
import { formatDateTime, formatKm, formatSeconds } from '@/utils/format'

const props = defineProps<{ id: string }>()

const activities = activitiesStore()

function speed(kmh: number | null | undefined): string {
  if (kmh == null) return '—'
  return `${kmh.toFixed(1)} км/ч`
}

onMounted(() => {
  if (activities.currentActivity?.id !== props.id) {
    activities.loadDetail(props.id)
  }
})
</script>

<style scoped>
.heading-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.sport-type {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.unit {
  font-size: 0.8rem;
  color: var(--color-muted);
  font-weight: 400;
}
</style>