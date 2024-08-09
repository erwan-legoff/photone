//https://pinia.vuejs.org/core-concepts/state.html
import { defineStore } from 'pinia'
//import type { PhotoDto } from './types/PhotoDto'
//https://nuxt.com/docs/getting-started/state-management
export const useUploadStore = defineStore({
  id: "upload-store",
  state: () => {
    return {
    files: [] as File[],
  }
  },
  actions: {
    async uploadPhoto(photo:File) {
      const uploadPhotoUrl = "http://localhost:8080/photos/dumb"
      console.log("photo:",photo)
      // Crée un objet FormData
      const formData = new FormData();
      formData.append(photo.name, photo);

      const response = await $fetch(uploadPhotoUrl, {
        method: "POST",
        body: formData,
      });
      
      console.log(JSON.stringify(response))
    }


  },
})
