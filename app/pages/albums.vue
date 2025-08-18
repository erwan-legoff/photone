<template>
  <div class="full-page-background">
    <v-container>
      <form @submit.prevent="submit">
        <v-text-field v-model="title" label="Titre">

        </v-text-field>

        <v-text-field v-model="description" label="Description">

        </v-text-field>
        <v-btn class="mt-2" text="Créer Album" type="submit" :disabled="!canSubmit" block></v-btn>


      </form>


    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useAlbumStore } from '~/stores/albumStore';

const albumStore = useAlbumStore()
const title = ref("")
const description = ref("")
const canSubmit = computed(() => title.value.length > 0)
const submit = () => { albumStore.createAlbum({ title: title.value, description: description.value }) }
</script>
