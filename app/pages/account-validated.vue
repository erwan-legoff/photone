<template>
    <v-container class="py-10">
        <v-sheet class="text-center mx-auto pa-6" elevation="12" max-width="600" rounded="lg" width="100%">
            <!-- === ÉTAT : LOADING === -->
            <template v-if="status === 'loading'">
                <v-progress-circular indeterminate color="primary" size="64" class="mb-6" />
                <h2 class="text-h5 mb-4">Checking your validation link…</h2>
                <p class="text-body-2 text-medium-emphasis">
                    Please wait a moment while we confirm your account.
                </p>
            </template>

            <!-- === ÉTAT : SUCCESS === -->
            <template v-else-if="status === 'success'">
                <v-icon class="mb-6" icon="mdi-check-circle" size="112" color="success" />
                <h2 class="text-h5 font-weight-bold mb-4">Account validated!</h2>
                <p class="text-body-2 mb-8">Your email has been successfully confirmed.</p>
                <v-btn color="primary" @click="navigateTo('/login')">Log in</v-btn>
            </template>

            <!-- === ÉTAT : ERROR === -->
            <template v-else>
                <v-icon class="mb-6" icon="mdi-alert" size="112" color="error" />
                <h2 class="text-h5 font-weight-bold mb-4">Oops… something went wrong</h2>
                <p class="text-body-2 mb-8">
                    The link may have expired or is invalid.<br />
                    You can request a new validation email below.
                </p>
                <v-btn color="secondary" @click="goToResend">Send a new email</v-btn>
            </template>
        </v-sheet>
    </v-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

type Status = 'loading' | 'success' | 'error'
const status = ref<Status>('loading')

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const token = route.query.token as string | undefined

onMounted(async () => {
    if (!token) {
        status.value = 'error'
        return
    }

    const ok = await userStore.verifyToken(token)
    status.value = ok ? 'success' : 'error'
})

const goToResend = () => router.push('/mail-verification')
</script>