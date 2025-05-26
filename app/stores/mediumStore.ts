import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import type { GetMediumDto } from './types/GetMediumDto'
import type { SoftDeleteMediumDto } from './types/SoftDeleteMediumDto'
import type { Medium } from './types/Medium'
import { encryptFile } from '~/tools/security/encryption/encryptFile'
import { useKeyStore } from './keyStore'
import { encryptFileBinary } from '~/tools/security/encryption/encryptFileBinary'
import { decryptFileBinary } from '~/tools/security/encryption/decryptFileBinary'

export const useMediumStore = defineStore('medium-store', () => {
  // State
  const media = ref<Medium[]>([])
  const mediaAreLoading = ref(false)
  
  // Stores - centralisées une seule fois
  const notificationStore = useNotificationStore()
  const keyStore = useKeyStore()
  
  // Actions
  async function uploadMedia(mediaFiles: File[]): Promise<void> {
    notificationStore.notifyInfo('uploading' + mediaFiles.length + ' photos')

    const { $api } = useNuxtApp()
    try {
      const formData = new FormData()
      
      if (await keyStore.shouldPromptForPin()) {
        return
      }

      const key = await keyStore.getKey() as CryptoKey
      for (const file of mediaFiles) {
        const encryptedFile = await encryptFileBinary(file, key)
        formData.append('media', encryptedFile)
      }

      await $api('/media', {
        method: 'POST',
        body: formData,
      })
      notificationStore.notifySuccess(mediaFiles.length + ' photos uploaded!')
      await fetchMedia()
    } catch (error) {
      notificationStore.handleError(error, 'getMedium')
    }
  }

  async function fetchMedium(getMediumDto: GetMediumDto): Promise<File | null> {
    const { $api } = useNuxtApp()

    try {
      const response = await $api<File>('/medium', {
        method: 'GET',
        params: getMediumDto,
      })
      return response
    } catch (error: unknown) {
      notificationStore.handleError(error, 'getMedium')
      return null
    }
  }

  async function deleteMedium(softDeleteMediumDto: SoftDeleteMediumDto): Promise<void> {
    const { $api } = useNuxtApp()

    try {
      await $api<void>('/medium', {
        method: 'DELETE',
        body: softDeleteMediumDto,
      })
      media.value = media.value.filter(
        (medium) => medium.id !== softDeleteMediumDto.id
      )
      notificationStore.notifySuccess('Photo successfully deleted!')
    } catch (error: unknown) {
      notificationStore.handleError(error, 'deleteMedium')
    }
  }

  async function fetchMediumUrls(): Promise<Array<string>> {
    const { $api } = useNuxtApp()

    try {
      const response = await $api<Array<string>>('/media', {
        method: 'GET',
      })
      return response
    } catch (error: unknown) {
      notificationStore.handleError(error, 'getMediumUrls')
      return []
    }
  }

  /**
   * Will fetch all media
   */
  async function fetchMedia(): Promise<void> {
    if (await keyStore.shouldPromptForPin()) {
      throw new Error('Please enter your key to unlock your key!')
    }
    
    notificationStore.notifyInfo('downloading photos...')
    const { $api } = useNuxtApp()

    try {
      // We start by fetching all URLS
      const mediumUrls = await fetchMediumUrls()

      // We then fetch all images at once in parallel
      const fetchPromises = mediumUrls.map(async (url) => {
        return await fetchOneMediumURL(url)
      })
      const files = await Promise.all(fetchPromises)
      media.value = files
    } catch (error: unknown) {
      notificationStore.handleError(error, 'getMedia')
    }

    async function fetchOneMediumURL(url: string): Promise<Medium> {
      const uuidMatch = url.match(/id=([0-9a-fA-F-]+)/)
      if (!uuidMatch) throw new Error('Invalid medium URL: ' + url)
      const uuid = uuidMatch[1]
      const blob = await $api<File>(url, { method: 'GET' })
      const decryptedFile = await keyStore.decryptFile(blob)
      return { id: uuid as string, file: decryptedFile }
    }
  }

  function getMedia() {
    return media.value
  }

  function isMediaLoading() {
    return mediaAreLoading.value
  }

  // Return - exposer le state et les actions
  return {
    // State properties (must be returned as-is for Pinia to track them)
    media,
    mediaAreLoading,
    
    // Actions
    uploadMedia,
    fetchMedium,
    deleteMedium,
    fetchMediumUrls,
    fetchMedia,
    getMedia,
    isMediaLoading,
  }
})