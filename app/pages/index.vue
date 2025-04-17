<template>
  <div class="full-page-background">
    <v-container>
      <div>
        <h1 class="text-h2">Photos</h1>
        <p class="text-subtitle-1 mb-5">Choose a file to upload to your private space</p>
        <div>
          <v-row>
            <v-file-input v-model="mediumToUpload" label="File input" accept="image/*" :multiple="true" />
            <v-btn @click="uploadMany"> upload </v-btn>
          </v-row>
        </div>
        <v-row>
          <v-col v-for="medium in media" :key="medium.name" cols="12" sm="6" md="4">
            <v-card tile>
              <v-img :src="createURL(medium)">
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate />
                  </div>
                </template>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useMediumStore } from '~/stores/mediumStore'

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

</script>
