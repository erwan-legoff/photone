<template>
    <v-row class="photo-grid" dense>
        <v-col v-for="(medium, i) in media" :key="medium.id" cols="12" sm="6" md="4" xl="2">
            <v-card class="overflow-hidden rounded-lg" elevation="2">
                <v-img :src="createURL(medium.file)" height="200" cover @click="() => emitOpen(i)">
                    <template #placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate />
                        </div>
                    </template>
                </v-img>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ media: Array<any> }>()
const emits = defineEmits<{
    (e: 'open', index: number): void
}>()

const emitOpen = (i: number) => emits('open', i)

const createURL = (file: File) => {
    try {
        return URL.createObjectURL(file)
    } catch (e) {
        return ''
    }
}
</script>

<style scoped>
.photo-grid .v-img {
    object-fit: cover;
    height: 200px;
}
</style>
