<template>
    <PinPopup :needsPin="keyStore.needsPIN" :loading="loading" @submit:pin="handlePinCreation"></PinPopup>
    <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
        <v-sheet class="pa-6 rounded" max-width="400" elevation="6">
            <h1 class="mb-5">Log in</h1>
            <v-form @submit.prevent="handleLogin">
                <v-row dense>
                    <v-col cols="12">
                        <v-text-field v-model="email" label="Email" variant="outlined" color="primary" />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Password"
                            variant="outlined" color="primary"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="showPassword = !showPassword" />
                    </v-col>

                    <v-col cols="12">
                        <v-btn type="submit" block color="primary" class="mt-4" size="large">
                            Connexion
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-sheet>
    </v-container>
</template>
<script setup lang="ts">
import PinPopup from '~/components/PinPopup.vue'
import type { LoginDto } from '~/stores/types/LoginDto'
import { useUserStore } from '~/stores/userStore'
const keyStore = useKeyStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const loginDto = computed<LoginDto>(() => ({
    email: email.value,
    password: password.value
}))
const userStore = useUserStore()
const handleLogin = async () => {
    await userStore.login(loginDto.value)
    if (await keyStore.hasWrappedKey()) {
        navigateTo("/photos")
    }
}

const handlePinCreation = async (pin: string) => {
    const wrapSucceeded = await keyStore.wrapKeyWithPIN(pin)

    if (wrapSucceeded) {
        navigateTo("/photos")
    }

}



</script>