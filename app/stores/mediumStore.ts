import { defineStore } from "pinia";
import type { GetMediumDto } from "./types/GetMediumDto";
import type { SoftDeleteMediumDto } from "./types/SoftDeleteMediumDto";
import type { Medium } from "./types/Medium";

export interface MediumState {
  media: Medium[];
  mediaAreLoading: boolean;
}

export const useMediumStore = defineStore("medium-store", {
  state: (): MediumState => {
    return {
      media: [],
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
        await this.fetchMedia();
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

    async deleteMedium(
      softDeleteMediumDto: SoftDeleteMediumDto
    ): Promise<void> {
      const notificationStore = useNotificationStore();

      const { $api } = useNuxtApp();

      try {
        const response = await $api<void>("/medium", {
          method: "DELETE",
          body: softDeleteMediumDto,
        });
        this.media = this.media.filter(
          (medium) => medium.id != softDeleteMediumDto.id
        );
        notificationStore.notifySuccess("Photo Successfully deleted !");
      } catch (error: unknown) {
        notificationStore.handleError(error, "deleteMedium");
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
        const fetchPromises = mediumUrls.map(async (url) => {
          const uuidMatch = url.match(/id=([0-9a-fA-F-]+)/);
          if (!uuidMatch) throw new Error("Invalid medium URL: " + url);
          const uuid = uuidMatch[1];
          const blob = await $api<File>(url, { method: "GET" });
          const file = new File([blob], `${uuid}.jpg`, { type: blob.type });
          return { id: uuid as string, file };
        });
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
