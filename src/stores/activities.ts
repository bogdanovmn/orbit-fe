import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api'
import type { FitBrief, FitDetail } from '@/api'

export const activitiesStore = defineStore('activitiesStore', () => {
  const activities = ref<FitBrief[]>([])
  const currentActivity = ref<FitDetail | null>(null)
  const isLoading = ref(false)
  const isUploading = ref(false)
  const isDeleting = ref<Set<string>>(new Set())

  async function load(): Promise<void> {
    isLoading.value = true
    try {
      activities.value = await api.getActivities()
    } finally {
      isLoading.value = false
    }
  }

  async function upload(file: File): Promise<FitBrief> {
    isUploading.value = true
    try {
      const activity = await api.uploadActivity(file)
      activities.value.push(activity)
      return activity
    } finally {
      isUploading.value = false
    }
  }

  async function loadDetail(id: string): Promise<void> {
    isLoading.value = true
    try {
      currentActivity.value = await api.getActivity(id)
    } finally {
      isLoading.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    isDeleting.value.add(id)
    try {
      await api.deleteActivity(id)
      activities.value = activities.value.filter(a => a.id !== id)
    } finally {
      isDeleting.value.delete(id)
    }
  }

  return { activities, currentActivity, isLoading, isUploading, isDeleting, load, upload, loadDetail, remove }
})