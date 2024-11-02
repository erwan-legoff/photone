//https://pinia.vuejs.org/core-concepts/state.html
import { defineStore } from 'pinia'
import type { GetMediumDto } from './types/GetMediumDto';
const SERVICE_ROOT = "http://localhost:8080"
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
 
      const UPLOAD_PHOTO_URL = SERVICE_ROOT + '/media'
      const formData = new FormData();
      formData.append("medium", medium);
      console.log('formData', JSON.stringify(formData))
      
      const response = await $fetch(UPLOAD_PHOTO_URL, {
          method: "POST",
          body: formData,
        });
      
      
        console.log(JSON.stringify(response))
      } catch (error) {
        
        console.error('error while uploading photo', error)
        
      }
    },

    async getMedium(getMediumDto: GetMediumDto): Promise<File>{
      const GET_MEDIUM_URL = SERVICE_ROOT + '/medium'
      try {
        const response = await $fetch<File>(GET_MEDIUM_URL, {
          method: "GET",
          params:getMediumDto
     
        });
        return response
      } catch (error: unknown) {
        if(error instanceof Error) console.error('error while getting photo', error.message)
        throw error
      }
    }


  },
})
