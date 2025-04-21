import { defineStore } from "pinia";
import type { GetMediumDto } from "./types/GetMediumDto";

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
    async uploadMedia(media: File[]): Promise<void> {
      const notificationStore = useNotificationStore();
      notificationStore.notifyInfo("uploading" + media.length + "photos");
      const { $api } = useNuxtApp();
      try {
        const formData = new FormData();

        media.forEach((file) => {
          formData.append("media", file);
        });

        await $api("/media", {
          method: "POST",
          body: formData,
        });
        notificationStore.notifySuccess(media.length + "photos uploaded !");
      } catch (error) {
        notificationStore.handleError(error, "getMedium");
      }
    },

    async fetchMedium(getMediumDto: GetMediumDto): Promise<File | null> {
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
        return null;
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
        return [];
      }
    },

    /**
     * Will fetch all media
     */
    async fetchMedia(): Promise<void> {
      const notificationStore = useNotificationStore();
      notificationStore.notifyInfo("downloading photos...");
      const { $api } = useNuxtApp();

      try {
        // We start by fetching all URLS
        const mediumUrls = await this.fetchMediumUrls();
        // We then fetch all images at once in parallel
        const fetchPromises = mediumUrls.map((url) =>
          $api<File>(url, { method: "GET" })
        );
        const files = await Promise.all(fetchPromises);
        this.media = files;
      } catch (error: unknown) {
        notificationStore.handleError(error, "getMedia");
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
