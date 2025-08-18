<template>
  <div class="full-page-background">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn color="primary" @click="dialog = true">{{ t('albums.createButton') }}</v-btn>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>{{ t('albums.createDialogTitle') }}</v-card-title>

          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-text-field v-model="title" :label="t('albums.titleLabel')" required></v-text-field>
              <v-text-field v-model="description" :label="t('albums.descriptionLabel')"></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="onCancel">{{ t('common.cancel') }}</v-btn>
            <v-btn :disabled="!canSubmit" color="primary" @click="submit">{{ t('albums.createButton') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAlbumStore } from '~/stores/albumStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const albumStore = useAlbumStore()
const dialog = ref(false)
const title = ref('')
const description = ref('')
const canSubmit = computed(() => title.value.trim().length > 0)

const resetForm = () => {
  title.value = ''
  description.value = ''
}

const onCancel = () => {
  resetForm()
  dialog.value = false
}

const submit = async () => {
  if (!canSubmit.value) return
  await albumStore.createAlbum({ title: title.value, description: description.value })
  resetForm()
  dialog.value = false
}
</script>
