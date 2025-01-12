//https://pinia.vuejs.org/core-concepts/state.html
import { defineStore } from 'pinia'
import type { GetMediumDto } from './types/GetMediumDto'
const SERVICE_ROOT =
  process.env.NUXT_MEDIUM_SERVICE_ROOT || 'http://localhost:8080'
//import type { PhotoDto } from './types/PhotoDto'
//https://nuxt.com/docs/getting-started/state-management

const UPLOAD_MEDIUM_URL = SERVICE_ROOT + '/medium'
const UPLOAD_MEDIA_URL = SERVICE_ROOT + '/media'
export interface MediumState {
  media: File[]
  mediaAreLoading: boolean
  errorMessage: string | null
}

export const useMediumStore = defineStore('medium-store', {
  state: (): MediumState => {
    return {
      media: [] as File[],
      mediaAreLoading: false as boolean,
      errorMessage: null,
    }
  },
  actions: {
    /**
     * Upload a file to the backend
     * @param medium - the file to upload
     */
    async uploadMedium(medium: File): Promise<void> {
      try {
        const formData = new FormData()
        formData.append('medium', medium)
        console.log('formData', JSON.stringify(formData))

        const response = await $fetch(UPLOAD_MEDIUM_URL, {
          method: 'POST',
          body: formData,
        })

        console.log(JSON.stringify(response))
      } catch (error) {
        this.handleError(error, 'uploadMedium')
        throw error
      }
    },
    async uploadMedia(media: File[]): Promise<void> {
      try {
        const formData = new FormData()

        media.forEach((file) => {
          formData.append("media", file)
        })


        const response = await $fetch(UPLOAD_MEDIA_URL, {
          method: 'POST',

          body: formData,
        })

        console.log(JSON.stringify(response))
      } catch (error) {
        this.handleError(error, 'uploadMedia')
        throw error
      }
    },

    async fetchMedium(getMediumDto: GetMediumDto): Promise<File> {
      const GET_MEDIUM_URL = SERVICE_ROOT + '/medium'
      try {
        const response = await $fetch<File>(GET_MEDIUM_URL, {
          method: 'GET',
          params: getMediumDto,
        })
        return response
      } catch (error: unknown) {
        this.handleError(error, 'getMedium')
        throw error
      }
    },

    async fetchMediumUrls(): Promise<Array<string>> {
      const GET_MEDIUM_URL = SERVICE_ROOT + '/media'
      try {
        const response = await $fetch<Array<string>>(GET_MEDIUM_URL, {
          method: 'GET',
        })
        return response
      } catch (error: unknown) {
        this.handleError(error, 'getMediumUrls')
        throw error
      }
    },

    async fetchMedia(): Promise<void> {
      try {
        const mediumUrls = await this.fetchMediumUrls()
        const fetchPromises = mediumUrls.map((url) =>
          $fetch<File>(url, { method: 'GET' })
        )
        const files = await Promise.all(fetchPromises)
        this.media = files
      } catch (error: unknown) {
        this.handleError(error, 'getMedia')
        throw error
      }
    },
    getMedia() {
      return this.media
    },
    isMediaLoading() {
      return this.isMediaLoading
    },
    /**
     * Gère les erreurs en les enregistrant dans l'état et en les loggant.
     * @param error - L'erreur capturée.
     * @param action - L'action où l'erreur s'est produite.
     */
    handleError(error: unknown, action: string): void {
      if (error instanceof Error) {
        console.error(`Erreur dans ${action}:`, error.message)
        this.errorMessage = `Erreur dans ${action}: ${error.message}`
      } else {
        console.error(`Erreur inconnue dans ${action}:`, error)
        this.errorMessage = `Erreur inconnue dans ${action}`
      }
    },
  },
})
