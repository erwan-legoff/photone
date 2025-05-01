<template>
    <v-dialog v-model="dialogVisible" fullscreen transition="dialog-bottom-transition" :scrim="false"
        content-class="bg-black pa-0" persistent>
        <v-toolbar flat dense class="position-absolute top-0 left-0 right-0"
            style="z-index: 11; background-color: rgba(0, 0, 0, 0.6);">
            <v-btn icon @click="$emit('close')" class="ml-2" style="color: white;">
                <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-spacer />

            <v-btn icon @click="currentMedium && $emit('delete', currentMedium)" class="mr-2" style="color: white;">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-toolbar>

        <v-carousel v-model="internalIndex" height="100vh" class="bg-black" show-arrows-on-hover hide-delimiters>
            <v-carousel-item v-for="(medium, i) in media" :key="medium.id" :value="i" :src="createURL(medium.file)" />
        </v-carousel>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Medium } from '~/stores/types/Medium'

const props = defineProps<{
    modelValue: boolean
    media: Medium[]
    modelIndex: number
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'close'): void
    (e: 'delete', medium: Medium): void
}>()

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const internalIndex = ref(props.modelIndex)

watch(() => props.modelIndex, (v) => (internalIndex.value = v))

const createURL = (file: File) => URL.createObjectURL(file)

const currentMedium = computed(() => props.media[internalIndex.value])
</script>