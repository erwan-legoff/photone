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
      const { $api } = useNuxtApp();

      try {
        const formData = new FormData();
        formData.append("medium", medium);

        await $api("/media", {
          method: "POST",
          body: formData,
        });

        notificationStore.notifySuccess("File uploaded successfully!");
      } catch (error) {
        notificationStore.handleError(error, "uploadMedium");
        throw error;
      }
    },

    async fetchMedium(getMediumDto: GetMediumDto): Promise<File> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();

      try {
        const response = await $api<File>("/medium", {
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
      const { $api } = useNuxtApp();

      try {
        const response = await $api<Array<string>>("/media", {
          method: "GET",
        });
        return response;
      } catch (error: unknown) {
        notificationStore.handleError(error, "getMediumUrls");
        throw error;
      }
    },

    async fetchMedia(): Promise<void> {
      const notificationStore = useNotificationStore();
      const { $api } = useNuxtApp();

      try {
        const mediumUrls = await this.fetchMediumUrls();
        const fetchPromises = mediumUrls.map((url) =>
          $api<File>(url, { method: "GET" })
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
      return this.mediaAreLoading;
    },
  },
});
