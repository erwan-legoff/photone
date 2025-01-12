//https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
//https://image.nuxt.com/usage/nuxt-img
<template>
  <div class="full-page-background">
    <v-container>
      <div>
        <h1>Photos</h1>
        <p>Choose a file to upload to your private space</p>
        <div>
          <v-row>
            <v-file-input
              v-model="mediumToUpload"
              label="File input"
              accept="image/*"
              :multiple="true"
            />
            <v-btn @click="uploadMany"> upload </v-btn>
          </v-row>
        </div>
        <v-row>
          <v-col
            v-for="medium in media"
            :key="medium.name"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card tile>
              <v-img :src="createURL(medium)">
                <!-- Vous pouvez ajouter du contenu overlay ici si nécessaire -->
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useMediumStore } from '~/stores/uploadStore'
const mediumStore = useMediumStore()

const mediumToUpload: Ref<File | File[] | null | undefined> = ref(null)
const media = computed(() => mediumStore.media)

const uploadOne = async () => {
  console.log("let's upload")
  if (!mediumToUpload.value) return console.log('photos is undefined or null')
  if ((mediumToUpload.value as Array<File>).length)
    return console.log('this is an array')
  console.log('everything seems ok')
  const photoFile = mediumToUpload.value as File

  await mediumStore.uploadMedium(photoFile)
  downloadAll()
}

const uploadMany = async () => {
  const filesToUpload: Array<File> = []
  if (!mediumToUpload.value) return console.log('photos is undefined or null')
  if (!Array.isArray(mediumToUpload.value)) {
    console.log('this is not an array')
    return await mediumStore.uploadMedia([mediumToUpload.value as File])
  }
  if ((mediumToUpload.value as File[]).length) {
    console.log('this is an array')
    return await mediumStore.uploadMedia(mediumToUpload.value as File[])
  }
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
