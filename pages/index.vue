//https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
//https://image.nuxt.com/usage/nuxt-img
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
      <div v-if="photoUrl.length">
      <nuxt-img
      :src="photoUrl"
      />
      </div>
      
    <div/>
<div/></div></div></template>

<script setup lang="ts">
import type { GetMediumDto } from '~/stores/types/GetMediumDto';
import { useMediumStore } from '~/stores/uploadStore'
const uploadStore = useMediumStore()
const photoUrl = ref("")

const photos: Ref<File | File[] | null | undefined> = ref(null)

const upload = () => {
  console.log("let's upload")
  if (!photos.value) return console.log("photos is undefined or null")
  if ((photos.value as Array<File>).length) return console.log("this is an array")
  console.log("everything seems ok")
  const photoFile = photos.value as File

  photoUrl.value = URL.createObjectURL(photoFile)
  uploadStore.uploadMedium(photoFile)
}

const download = async () => {
  console.log('lets download')
  const getMediumDto: GetMediumDto = {
    id: '38dbddbc-82c8-4efb-9a1f-3065b86ff643'
  }

  const mediumFile = await uploadStore.getMedium(getMediumDto)
  photoUrl.value = URL.createObjectURL(mediumFile)
}

onMounted(() => {
  download()
})
  






</script>
