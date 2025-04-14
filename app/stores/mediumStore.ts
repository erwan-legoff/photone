//https://pinia.vuejs.org/core-concepts/state.html
import { defineStore } from "pinia";
import type { GetMediumDto } from "./types/GetMediumDto";
const SERVICE_ROOT =
  process.env.NUXT_MEDIUM_SERVICE_ROOT || "http://localhost:8080";
//import type { PhotoDto } from './types/PhotoDto'
//https://nuxt.com/docs/getting-started/state-management

export interface MediumState {
  media: File[];
  mediaAreLoading: boolean;
}

export const useMediumStore = defineStore("medium-store", {
  state: (): MediumState => {
    return {
      media: [] as File[],
      mediaAreLoading: false as boolean,
    };
  },
  actions: {
    /**
     * Upload a file to the backend
     * @param medium - the file to upload
     */
    async uploadMedium(medium: File): Promise<void> {
      const notificationStore = useNotificationStore();
      try {
        const UPLOAD_PHOTO_URL = SERVICE_ROOT + "/media";
        const formData = new FormData();
        formData.append("medium", medium);

        const response = await $fetch(UPLOAD_PHOTO_URL, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        notificationStore.notifySuccess("File uploaded successfully!");
      } catch (error) {
        notificationStore.handleError(error, "uploadMedium");
        throw error;
      }
    },

    async fetchMedium(getMediumDto: GetMediumDto): Promise<File> {
      const notificationStore = useNotificationStore();
      const GET_MEDIUM_URL = SERVICE_ROOT + "/medium";
      try {
        const response = await $fetch<File>(GET_MEDIUM_URL, {
          method: "GET",
          params: getMediumDto,
        });
        return response;
      } catch (error: unknown) {
        notificationStore.handleError(error, "getMedium");
        throw error;
      }
    },

    async fetchMediumUrls(): Promise<Array<string>> {
      const notificationStore = useNotificationStore();
      const GET_MEDIUM_URL = SERVICE_ROOT + "/media";
      try {
        const response = await $fetch<Array<string>>(GET_MEDIUM_URL, {
          method: "GET",
          credentials: "include",
        });
        return response;
      } catch (error: unknown) {
        notificationStore.handleError(error, "getMediumUrls");
        throw error;
      }
    },

    async fetchMedia(): Promise<void> {
      const notificationStore = useNotificationStore();
      try {
        const mediumUrls = await this.fetchMediumUrls();
        const fetchPromises = mediumUrls.map((url) =>
          $fetch<File>(url, { method: "GET", credentials: "include" })
        );
        const files = await Promise.all(fetchPromises);
        this.media = files;
      } catch (error: unknown) {
        notificationStore.handleError(error, "getMedia");
        throw error;
      }
    },
    getMedia() {
      return this.media;
    },
    isMediaLoading() {
      return this.isMediaLoading;
    },
  },
});
