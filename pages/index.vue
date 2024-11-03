//https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
//https://image.nuxt.com/usage/nuxt-img
<template>
  <v-layout>
    <div>
      <h1>Salut ! Tu es sur la première page de erwan</h1>
      <p>Ici tu vas pouvoir uploader une image</p>
      <div>
        <v-file-input v-model="mediumToUpload" label="File input" accept="image/*" />
        <v-btn @click="upload">
          upload

        </v-btn>
        <v-row>
          <v-col v-for="medium in media" :key="medium.name" cols="12" sm="6" md="4">
            <v-card flat tile>
              <v-img :src="createURL(medium)" aspect-ratio="1" class="white--text align-end" height="200">
                <!-- Vous pouvez ajouter du contenu overlay ici si nécessaire -->
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </div>


      <div />
    </div>
  </v-layout>
</template>

<script setup lang="ts">
import { useMediumStore } from '~/stores/uploadStore'
const mediumStore = useMediumStore()


const mediumToUpload: Ref<File | File[] | null | undefined> = ref(null)
const media = computed(() => mediumStore.media)

const upload = async () => {
  console.log("let's upload")
  if (!mediumToUpload.value) return console.log("photos is undefined or null")
  if ((mediumToUpload.value as Array<File>).length) return console.log("this is an array")
  console.log("everything seems ok")
  const photoFile = mediumToUpload.value as File

  await mediumStore.uploadMedium(photoFile)
  downloadAll()
}

const downloadAll = async () => {
  console.log('lets download')
  mediumStore.fetchMedia()

}

const createURL = (file: File) => {
  return URL.createObjectURL(file)
}

onMounted(() => {
  downloadAll()
})


//




</script>
