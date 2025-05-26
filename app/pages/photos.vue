<template>
  <div class="full-page-background">
    <v-container>
      <div>
        <PinPopup :needsPin="keyStore.needsPinVerification" :loading="pinLoading" @submit:pin="unwrapKey"></PinPopup>
        <div v-if="isMediumOpen">
          <MediaViewer v-model="isMediumOpen" :media="media" :model-index="openedMediumIndex"
            @close="isMediumOpen = false" @delete="deleteMedium" />

        </div>
        <div v-else>
          <h1 class="text-h2">Photos</h1>
          <p class="text-subtitle-1 mb-5">{{ $t("global.upload_your_file") }}</p>
          <div>
            <v-row>
              <v-file-input v-model="mediumToUpload" :label="$t('global.choose_a_file')" accept="image/*"
                :multiple="true" />
              <v-btn :disabled="!canUpload" @click="uploadMany"> {{ $t("global.upload") }} </v-btn>
            </v-row>
          </div>
          <v-row>
            <v-col v-for="(medium, i) in media" :key="medium.id" cols="12" sm="6" md="4">
              <v-card tile>
                <v-img :src="createURL(medium.file)" @click="() => { openMedium(i) }">
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
const keyStore = useKeyStore()
const pinLoading = ref(false)

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
const openedMediumIndex = ref(0)
const openedMedium = computed(() => media.value[openedMediumIndex.value])
const openMedium = (mediumNumber: number) => {
  openedMediumIndex.value = mediumNumber
  isMediumOpen.value = true
}
const deleteMedium = () => {
  const notificationStore = useNotificationStore()
  if (!openedMedium.value) return notificationStore.notifyError("Something went wrong when deleting the photo(s).")
  mediumStore.deleteMedium(openedMedium.value)
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
const unwrapKey = async (pin: string) => {
  await keyStore.unwrapKeyWithPIN(pin)
  downloadAll()
}
const createURL = (file: File) => {
  return URL.createObjectURL(file)
}

onMounted(() => {
  downloadAll()
})

</script>
