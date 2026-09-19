import { authApi } from './common'

// ===================== TYPES =====================

export interface GpxBrief {
  id: string
  fileName: string
  trackName: string | null
  startTime: string | null
  distanceM: number
  durationSec: number | null
  createdAt: string
}

export interface GpxDetail {
  id: string
  fileName: string
  trackName: string | null
  startTime: string | null
  distanceM: number
  ascentM: number
  descentM: number
  durationSec: number | null
  pointsCount: number
  yandexMapUrl: string | null
  createdAt: string
}

export interface FitLap {
  startTime: string | null
  elapsedSec: number | null
  distanceM: number | null
  avgHeartRate: number | null
  maxHeartRate: number | null
  avgSpeedKmh: number | null
  calories: number | null
}

export interface SeriesPoint {
  seconds: number
  heartRate: number | null
  speedKmh: number | null
  altitudeM: number | null
  cadence: number | null
}

export interface FitBrief {
  id: string
  fileName: string
  sport: string | null
  subSport: string | null
  startTime: string | null
  distanceM: number | null
  totalElapsedSec: number | null
  totalTimerSec: number | null
  avgHeartRate: number | null
  maxHeartRate: number | null
  avgSpeedKmh: number | null
  createdAt: string
}

export interface FitDetail {
  id: string
  fileName: string
  sport: string | null
  subSport: string | null
  startTime: string | null
  distanceM: number | null
  totalElapsedSec: number | null
  totalTimerSec: number | null
  avgHeartRate: number | null
  maxHeartRate: number | null
  avgSpeedKmh: number | null
  maxSpeedKmh: number | null
  totalAscentM: number | null
  totalDescentM: number | null
  calories: number | null
  createdAt: string
  laps: FitLap[]
  series: SeriesPoint[]
}

export enum GpxTransport {
  Auto = 'auto',
  Pedestrian = 'pd',
}

// ===================== GPX API =====================

export async function getTracks(): Promise<GpxBrief[]> {
  return authApi.get<GpxBrief[]>('/gpx')
}

export async function uploadTrack(file: File): Promise<GpxBrief> {
  const formData = new FormData()
  formData.append('file', file)
  return authApi.post<GpxBrief>('/gpx', formData)
}

export async function getTrack(id: string, transport: GpxTransport): Promise<GpxDetail> {
  return authApi.get<GpxDetail>(`/gpx/${id}`, { transport })
}

export async function deleteTrack(id: string): Promise<void> {
  return authApi.delete(`/gpx/${id}`)
}

// ===================== FIT API =====================

export async function getActivities(): Promise<FitBrief[]> {
  return authApi.get<FitBrief[]>('/fit')
}

export async function uploadActivity(file: File): Promise<FitBrief> {
  const formData = new FormData()
  formData.append('file', file)
  return authApi.post<FitBrief>('/fit', formData)
}

export async function getActivity(id: string): Promise<FitDetail> {
  return authApi.get<FitDetail>(`/fit/${id}`)
}

export async function deleteActivity(id: string): Promise<void> {
  return authApi.delete(`/fit/${id}`)
}