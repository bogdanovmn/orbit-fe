import { format, parseISO } from 'date-fns'

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  return format(parseISO(value), 'dd.MM.yyyy HH:mm')
}

export function formatKm(distanceM: number | null | undefined): string {
  if (distanceM == null) return '—'
  return `${(distanceM / 1000).toFixed(2)} км`
}

export function formatSeconds(totalSec: number | null | undefined): string {
  if (totalSec == null) return '—'
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  if (hours > 0) {
    return `${hours} ч ${minutes} мин`
  }
  return `${minutes} мин ${seconds} сек`
}