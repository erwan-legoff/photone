<template>
  <div class="full-page-background">
    <v-container>
      <div>
        <div v-if="isMediumOpen">
          <v-dialog v-model="isMediumOpen" fullscreen transition="dialog-bottom-transition" :scrim="false"
            content-class="bg-black pa-0" persistent>
            <v-btn icon @click="isMediumOpen = false" class="position-absolute top-0 right-0 mx-8 my-8"
              style="z-index: 10; color: white;">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-carousel v-model="openedMedium" height="100vh" class="bg-black" show-arrows-on-hover hide-delimiters>
              <v-carousel-item v-for="(medium, i) in media" :key="medium.name" :value="i" :src="createURL(medium)" />
            </v-carousel>


          </v-dialog>

        </div>
        <div v-else>
          <h1 class="text-h2">Photos</h1>
          <p class="text-subtitle-1 mb-5">Choose a file to upload to your private space</p>
          <div>
            <v-row>
              <v-file-input v-model="mediumToUpload" label="File input" accept="image/*" :multiple="true" />
              <v-btn @click="uploadMany" :disabled="!canUpload"> upload </v-btn>
            </v-row>
          </div>
          <v-row>
            <v-col v-for="(medium, i) in media" :key="medium.name" cols="12" sm="6" md="4">
              <v-card tile>
                <v-img :src="createURL(medium)" @click="() => { openMedium(i) }">
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
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useMediumStore } from '~/stores/mediumStore'

const mediumStore = useMediumStore()
const mediumToUpload: Ref<File | File[] | null | undefined> = ref(null)
const canUpload = computed(() => {
  if (!mediumToUpload.value) return false
  if (Array.isArray(mediumToUpload.value)) {
    return mediumToUpload.value.length > 0
  }
  return true
})
const media = computed(() => mediumStore.media)
const isMediumOpen = ref(false)
const openedMedium = ref(0)
const openMedium = (mediumNumber: number) => {
  openedMedium.value = mediumNumber
  isMediumOpen.value = true
}
const uploadMany = async () => {
  const notificationStore = useNotificationStore()
  if (!mediumToUpload.value) return notificationStore.notifyError("Something went wrong when selecting the photo(s).")
  if (!Array.isArray(mediumToUpload.value)) {
    return await mediumStore.uploadMedia([mediumToUpload.value as File])
  }
  if ((mediumToUpload.value as File[]).length) {
    return await mediumStore.uploadMedia(mediumToUpload.value as File[])
  }
}

const downloadAll = async () => {
  mediumStore.fetchMedia()
}

const createURL = (file: File) => {
  return URL.createObjectURL(file)
}

onMounted(() => {
  downloadAll()
})

</script>
