import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api'
import type { GpxBrief, GpxDetail, GpxTransport } from '@/api'

export const tracksStore = defineStore('tracksStore', () => {
  const tracks = ref<GpxBrief[]>([])
  const currentTrack = ref<GpxDetail | null>(null)
  const isLoading = ref(false)
  const isUploading = ref(false)
  const isDeleting = ref<Set<string>>(new Set())

  async function load(): Promise<void> {
    isLoading.value = true
    try {
      tracks.value = await api.getTracks()
    } finally {
      isLoading.value = false
    }
  }

  async function upload(file: File): Promise<GpxBrief> {
    isUploading.value = true
    try {
      const track = await api.uploadTrack(file)
      tracks.value.push(track)
      return track
    } finally {
      isUploading.value = false
    }
  }

  async function loadDetail(id: string, transport: GpxTransport): Promise<void> {
    isLoading.value = true
    try {
      currentTrack.value = await api.getTrack(id, transport)
    } finally {
      isLoading.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    isDeleting.value.add(id)
    try {
      await api.deleteTrack(id)
      tracks.value = tracks.value.filter(t => t.id !== id)
    } finally {
      isDeleting.value.delete(id)
    }
  }

  return { tracks, currentTrack, isLoading, isUploading, isDeleting, load, upload, loadDetail, remove }
})