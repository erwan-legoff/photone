import { defineStore } from "pinia";
import type { GetMediumDto } from "./types/GetMediumDto";
import type { SoftDeleteMediumDto } from "./types/SoftDeleteMediumDto";
import type { Medium } from "./types/Medium";
import { encryptFile } from "~/tools/security/encryption/encryptFile";
import { useKeyStore } from "./keyStore";
import { encryptFileBinary } from "~/tools/security/encryption/encryptFileBinary";
import { decryptFileBinary } from "~/tools/security/encryption/decryptFileBinary";

export interface MediumState {
  media: Medium[];
  mediaAreLoading: boolean;
}

export const useMediumStore = defineStore("medium-store", {
  state: (): MediumState => {
    return {
      media: [],
      mediaAreLoading: false,
    };
  },
  actions: {
    async uploadMedia(media: File[]): Promise<void> {
      const notificationStore = useNotificationStore();
      const keyStore = useKeyStore();
      notificationStore.notifyInfo("uploading" + media.length + "photos");

      const { $api } = useNuxtApp();
      try {
        const formData = new FormData();
        const key = keyStore.getKey();
        if (!key) return notificationStore.notifyError("No Key found !");
        notificationStore.notifyInfo("Appending...");
        for (const file of media) {
          const encryptedFile = await encryptFileBinary(file, key);

          formData.append("media", encryptedFile);
        }

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
      const keyStore = useKeyStore();
      notificationStore.notifyInfo("downloading photos...");
      const { $api } = useNuxtApp();

      try {
        // We start by fetching all URLS
        const mediumUrls = await this.fetchMediumUrls();

        // We then fetch all images at once in parallel
        const fetchPromises = mediumUrls.map(async (url) => {
          return await fetchMediaURL(url);
        });
        const files = await Promise.all(fetchPromises);
        this.media = files;
      } catch (error: unknown) {
        notificationStore.handleError(error, "getMedia");
      }

      async function fetchMediaURL(url: string): Promise<Medium> {
        const uuidMatch = url.match(/id=([0-9a-fA-F-]+)/);
        if (!uuidMatch) throw new Error("Invalid medium URL: " + url);
        const uuid = uuidMatch[1];
        const blob = await $api<File>(url, { method: "GET" });
        const key = keyStore.getKey();
        if (!key) throw new Error("No key found !");
        const decrypedFile = await decryptFileBinary(blob, key);
        return { id: uuid as string, file: decrypedFile };
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
