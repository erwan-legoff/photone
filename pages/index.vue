import { useUploadStore } from '../stores/photo/uploadStore';
import { useUploadStore } from '../stores/uploadStore';
//https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
<template>
  <div>
    <h1>Salut ! Tu es sur la première page de erwan</h1>
    <p>Ici tu vas pouvoir uploader une image</p>
    <div>
      <v-file-input
      v-model="photos"
        
        label="File input"
        accept="image/*"

      />
      <v-btn @click="upload">
        upload
        
      </v-btn>
    <div/>
<div/></div></div></template>

<script setup lang="ts">
import { useUploadStore } from '~/stores/uploadStore'
const uploadStore = useUploadStore()

const photos: Ref<File | File[] | null | undefined> = ref(null)

const upload = () => {
  console.log("let's upload")
  if (!photos.value) return console.log("photos is undefined or null")
  if ((photos.value as Array<File>).length) return console.log("this is an array")
  console.log("everything seems ok")
  uploadStore.uploadPhoto(photos.value as File)
}

  
// const validationRules = [
//   (files: File[]) => validateSize(files),
// ];

//Validate the size of the file
// const validateSize = (files: File[]) => {
//   if(!files || !files.length || !files[0]) {
//     return true;
//   }
//   if (files[0].size > 1000000) {

//     return 'File size should be less than 1MB';
//   }
//   return true;
// };





</script>
