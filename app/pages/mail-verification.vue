<template>
    <v-container class="py-8">
        <v-sheet class="text-center mx-auto pa-6" elevation="10" max-width="500" rounded="xl" width="100%">


            <v-icon class="mb-6" color="secondary" size="96" icon="mdi-email-alert" />

            <h2 class="text-h5 font-weight-bold mb-4">
                {{ $t("mail_verification.title") }}
            </h2>

            <p :class="['text-body-1', 'mb-8']">
                {{ $t("mail_verification.email_explanation") }}
            </p>


            <!-- Countdown -->
            <h1 :class="['text-h2 font-weight-bold mb-2', { 'shake text-error': showError }]">
                {{ secondCounter }}
            </h1>

            <h4 v-if="secondCounter" :class="[
                'text-body-1 font-weight-medium mb-6',
                { 'shake text-error': showError }
            ]">
                {{ $t("mail_verification.please_wait") }}
            </h4>


            <!-- Capture click on wrapper -->
            <div @click="handleClick">
                <v-btn color="primary" size="large" :disabled="!!secondCounter" class="mb-8">
                    {{ $t("mail_verification.send_new_mail") }}
                </v-btn>
            </div>

            <!-- Helper -->
            <p class="text-body-2 text-medium-emphasis">
                {{ $t("mail_verification.no_mail") }} </p>

        </v-sheet>
    </v-container>

</template>

<script setup lang="ts">
definePageMeta({
    public: true
})

defineI18nRoute({
    paths: {
        fr: '/verification-mail',
        en: '/mail-verification'
    }
})

import { useIntervalFn } from '@vueuse/core'
const route = useRoute()
const SECONDS_BEFORE_SENDING_MAIL = 200;
const userStore = useUserStore()
const emailRegex = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]+$/;


const validateAndAssignEmail = () => {
    const email = route.query.email
    if (typeof email === 'string') {
        const trimmed = email.trim()
        const lengthOk = trimmed.length >= 8 && trimmed.length <= 60
        if (lengthOk && emailRegex.test(trimmed)) {
            if (!userStore.email) {
                userStore.email = trimmed
            }
        }
    }
}

let secondCounter: Ref<number> = ref(SECONDS_BEFORE_SENDING_MAIL)


const { pause: stopCountDown, resume: startCountdown } = useIntervalFn(() => {
    if (secondCounter.value > 0) {
        secondCounter.value--
    } else {
        stopCountDown()
    }

}, 1000, { immediate: false })

const sendMail = async () => {
    await userStore.sendValidationEmail()
    secondCounter.value = SECONDS_BEFORE_SENDING_MAIL
    startCountdown()
}

const showError = ref(false)

const handleClick = () => {
    if (secondCounter.value > 0) {
        showError.value = true
        setTimeout(() => {
            showError.value = false
        }, 600) // durée de l'animation
        return
    }

    sendMail()
}

const animateCounter = ref(false)

watch(secondCounter, () => {
    animateCounter.value = true
    setTimeout(() => animateCounter.value = false, 300)
})


onMounted(async () => {
    validateAndAssignEmail()
    await sendMail()
    startCountdown()
})
onUnmounted(() => {
    stopCountDown()
})


</script>

<style scoped>
@keyframes shake {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    50% {
        transform: translateX(5px);
    }

    75% {
        transform: translateX(-5px);
    }

    100% {
        transform: translateX(0);
    }
}

.shake {
    animation: shake 0.6s;
}

.text-error {
    color: #f44336;
    /* rouge classique Material Design */
}
</style>