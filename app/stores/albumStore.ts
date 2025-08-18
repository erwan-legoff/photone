import { defineStore } from "pinia";
import { useNotificationStore } from "./notificationStore";
import type { CreateAlbumDtoRequest } from "./types/album/CreateAlbumDtoRequest";
import type { Medium } from "./types/Medium";

export const useAlbumStore = defineStore("album-store", () => {
  // State
  const album = ref<Medium[][]>([]);
  const albumsAreLoading = ref(false);

  // Stores - centralisées une seule fois
  const notificationStore = useNotificationStore();
  const keyStore = useKeyStore();

  // Actions
  async function createAlbum(album: CreateAlbumDtoRequest): Promise<void> {
    notificationStore.notifyInfo(`Uploading ${album.title} ...`);

    const { $api } = useNuxtApp();
    try {
      if (await keyStore.shouldPromptForPin()) {
        return;
      }

      await $api("/album", {
        method: "POST",
        body: album,
      });
      notificationStore.notifySuccess(`${album.title} uploaded!`);
    } catch (error) {
      notificationStore.handleError(error, "getMedium");
    }
  }

  // Return - exposer le state et les actions
  return {
    // State properties (must be returned as-is for Pinia to track them)
    mediaAreLoading: albumsAreLoading,

    // Actions
    createAlbum,
  };
});
