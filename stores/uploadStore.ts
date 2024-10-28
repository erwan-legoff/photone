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
    async uploadPhoto(medium: File) {
      try {
 
      const uploadPhotoUrl = "http://localhost:8080/medias"
      const formData = new FormData();
      formData.append("medium", medium);
      console.log('formData', JSON.stringify(formData))
      
      const response = await $fetch(uploadPhotoUrl, {
          method: "POST",
          body: formData,
        });
      
      
        console.log(JSON.stringify(response))
      } catch (error) {
        
        console.error('error while uploading photo', error)
        
      }
    }


  },
})
