<template>
  <svg v-if="hasData" class="series-chart" viewBox="0 0 800 200" preserveAspectRatio="none" role="img" :aria-label="label">
    <line
      x1="0" y1="200" x2="800" y2="200"
      stroke="var(--color-border)" stroke-width="1"
    />
    <polyline
      :points="polyline"
      fill="none"
      stroke="var(--color-primary)"
      stroke-width="2"
      stroke-linejoin="round"
    />
  </svg>
  <div v-else class="empty">Нет данных для графика.</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SeriesPoint } from '@/api'

const props = defineProps<{ series: SeriesPoint[] }>()

const label = computed(() => props.series.length > 0 ? `График пульса, ${props.series.length} точек` : '')

const values = computed(() => props.series
  .map(p => p.heartRate)
  .filter((v): v is number => v != null))

const hasData = computed(() => values.value.length >= 2)

const polyline = computed(() => {
  if (!hasData.value) return ''
  const W = 800
  const H = 200
  const PAD = 12
  const min = Math.min(...values.value)
  const max = Math.max(...values.value)
  const span = max - min || 1
  const n = props.series.length
  const step = (W - 2 * PAD) / (n - 1)
  return props.series
    .map((p, i) => {
      const x = PAD + i * step
      const heartRate = p.heartRate
      if (heartRate == null) return null
      const y = H - PAD - ((heartRate - min) / span) * (H - 2 * PAD)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .filter((v): v is string => v != null)
    .join(' ')
})
</script>