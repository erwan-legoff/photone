<template>
    <v-dialog :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" max-width="820">

        <v-card>
            <v-card-title class="text-h6">
                {{ $t('cgu.summaryTitle') }}
            </v-card-title>
            <v-divider />
            <v-card-text class="py-6">

                <div class="mb-8">
                    <p class="mb-3">
                        {{ $t('cgu.summaryP1') }}
                    </p>
                    <p class="mb-3">
                        {{ $t('cgu.summaryP2') }}
                    </p>
                    <p>
                        {{ $t('cgu.summaryP3') }}
                    </p>
                </div>
            </v-card-text>
            <v-card-title class="text-h6">
                {{ $t('cgu.termsTitle') }}
            </v-card-title>
            <v-divider />

            <v-card-text class="py-6">
                <section class="mb-6">
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ $t('cgu.article1.title') }}</h3>
                    <p>
                        {{ $t('cgu.article1.content') }}
                    </p>
                </section>

                <section class="mb-6">
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ $t('cgu.article2.title') }}</h3>
                    <p>
                        {{ $t('cgu.article2.content') }}
                    </p>
                </section>

                <section class="mb-6">
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ $t('cgu.article3.title') }}</h3>
                    <ul class="pl-6">
                        <li>{{ $t('cgu.article3.li1') }}</li>
                        <li>{{ $t('cgu.article3.li2') }}</li>
                        <li>{{ $t('cgu.article3.li3') }}</li>
                    </ul>
                </section>

                <section class="mb-6">
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ $t('cgu.article4.title') }}</h3>
                    <ol class="pl-6">
                        <li>{{ $t('cgu.article4.li1') }}</li>
                        <li>{{ $t('cgu.article4.li2') }}</li>
                        <li>{{ $t('cgu.article4.li3') }}</li>
                        <li>{{ $t('cgu.article4.li4') }}</li>
                    </ol>
                </section>

                <section class="mb-6">
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ $t('cgu.article5.title') }}</h3>
                    <p>
                        {{ $t('cgu.article5.content') }}
                    </p>
                </section>

                <section class="mb-6">
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ $t('cgu.article6.title') }}</h3>
                    <p>
                        {{ $t('cgu.article6.content') }}
                    </p>
                </section>

                <section>
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ $t('cgu.article7.title') }}</h3>
                    <p>
                        {{ $t('cgu.article7.content') }}
                    </p>
                </section>
            </v-card-text>

            <v-divider />

            <v-card-actions class="justify-end">
                <v-btn variant="text" @click="emit('update:modelValue', false)">{{ $t('cgu.close') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()
</script>