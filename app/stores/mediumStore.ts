import { defineStore } from "pinia";
import { ref, readonly } from "vue";
import type { GetMediumDto } from "./types/GetMediumDto";
import type { SoftDeleteMediumDto } from "./types/SoftDeleteMediumDto";
import type { Medium } from "./types/Medium";
import { encryptFile } from "~/tools/security/encryption/encryptFile";
import { useI18n } from "vue-i18n";
import { useKeyStore } from "./keyStore";
import { encryptFileBinary } from "~/tools/security/encryption/encryptFileBinary";
import { decryptFileBinary } from "~/tools/security/encryption/decryptFileBinary";
import type { GetMediumLinkResponseDto } from "./types/GetMediumLinkResponseDto";

export const useMediumStore = defineStore("medium-store", () => {
  // State
  const media = ref<Medium[]>([]);
  const mediaAreLoading = ref(false);

  // Stores - centralisées une seule fois
  const notificationStore = useNotificationStore();
  const keyStore = useKeyStore();

  // Actions
  async function uploadMedia(mediaFiles: File[]): Promise<void> {
    const { t } = useI18n();
    notificationStore.notifyInfo(
      t("global.uploading_photos", { count: mediaFiles.length })
    );

    const { $api } = useNuxtApp();
    try {
      const formData = new FormData();

      if (await keyStore.shouldPromptForPin()) {
        return;
      }

      const key = (await keyStore.getKey()) as CryptoKey;
      for (const file of mediaFiles) {
        const encryptedFile = await encryptFileBinary(file, key);
        formData.append("media", encryptedFile);
      }

      await $api("/media", {
        method: "POST",
        body: formData,
      });
      notificationStore.notifySuccess(
        t("global.photos_uploaded", { count: mediaFiles.length })
      );
      await fetchMedia();
    } catch (error) {
      notificationStore.handleError(error, "getMedium");
    }
  }

  async function deleteMedium(
    softDeleteMediumDto: SoftDeleteMediumDto
  ): Promise<void> {
    const { $api } = useNuxtApp();

    const { t } = useI18n();
    try {
      await $api<void>("/medium", {
        method: "DELETE",
        body: softDeleteMediumDto,
      });
      media.value = media.value.filter(
        (medium) => medium.id !== softDeleteMediumDto.id
      );
      notificationStore.notifySuccess(t("global.photo_deleted"));
    } catch (error: unknown) {
      notificationStore.handleError(error, "deleteMedium");
    }
  }

  async function fetchMediumUrls(): Promise<Array<GetMediumLinkResponseDto>> {
    const { $api } = useNuxtApp();

    try {
      const response = await $api<Array<GetMediumLinkResponseDto>>("/media", {
        method: "GET",
      });
      return response;
    } catch (error: unknown) {
      notificationStore.handleError(error, "getMediumUrls");
      return [];
    }
  }

  /**
   * Will fetch all media
   */
  async function fetchMedia(): Promise<void> {
    if (await keyStore.shouldPromptForPin()) {
      throw new Error("Please enter your key to unlock your key!");
    }

    notificationStore.notifyInfo("downloading photos...");
    const { $api } = useNuxtApp();

    try {
      // We start by fetching all URLS
      const mediumUrls = await fetchMediumUrls();

      // We then fetch all images at once in parallel
      const fetchPromises = mediumUrls.map(async (mediumDto) => {
        return await fetchOneMediumURL(mediumDto);
      });
      const files = await Promise.all(fetchPromises);
      media.value = files;
    } catch (error: unknown) {
      notificationStore.handleError(error, "getMedia");
    }

    async function fetchOneMediumURL(
      getMediumDto: GetMediumLinkResponseDto
    ): Promise<Medium> {
      const response = await fetch(getMediumDto.url);
      const blob = await response.blob();
      const fileName =
        extractFileNameFromUrl(getMediumDto.url) ?? `${getMediumDto.id}.bin`;
      const file = new File([blob], fileName, {
        type: blob.type || "application/octet-stream",
      });
      const decryptedFile = await keyStore.decryptFile(file);

      return { id: getMediumDto.id, file: decryptedFile };
    }
  }

  function extractFileNameFromUrl(url: string): string | null {
    try {
      const pathname = new URL(url).pathname;
      const name = pathname.substring(pathname.lastIndexOf("/") + 1);
      return decodeURIComponent(name);
    } catch {
      return null;
    }
  }

  function getMedia() {
    return media.value;
  }

  function isMediaLoading() {
    return mediaAreLoading.value;
  }

  // Return - exposer le state et les actions
  return {
    // State properties (must be returned as-is for Pinia to track them)
    media,
    mediaAreLoading,

    // Actions
    uploadMedia,
    deleteMedium,
    fetchMediumUrls,
    fetchMedia,
    getMedia,
    isMediaLoading,
  };
});
