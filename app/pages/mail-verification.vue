<template>
    <v-container>
        <v-sheet class="pa-4 text-center mx-auto" elevation="12" max-width="600" rounded="lg" width="100%">
            <v-icon class="mb-5" color="secondary" icon="mdi-email-alert" size="112"></v-icon>

            <h2 class="text-h5 mb-6">Please check your mail inbox to validate your account</h2>
            <h1 :class="{ counter: true, animate: animateCounter }">{{ secondCounter }}</h1>
            <h4 v-if="secondCounter"> Wait before you can send a new email validation</h4>
            <v-btn color="primary" :disabled="!!secondCounter" @click="sendMail">
                Send a new mail
            </v-btn>
            <p class="mb-4 text-medium-emphasis text-body-2">
                In order to verify your email address, you must click on the link we sent to your email address.
                <br>
                The link will expire in 10 minutes.
                <br>

                If you don't find it, please check your spams or wait a few minutes.
                <br>
                If you didn't receive it, you can wait the end of the countdown to resend an email.
            </p>

            <v-divider class="mb-4"></v-divider>


            <div class="text-end">

            </div>
        </v-sheet>
    </v-container>
</template>

<script setup lang="ts">

import { useIntervalFn } from '@vueuse/core'

const SECONDS_BEFORE_SENDING_MAIL = 200;
const userStore = useUserStore()


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

const animateCounter = ref(false)

watch(secondCounter, () => {
    animateCounter.value = true
    setTimeout(() => animateCounter.value = false, 300)
})


onMounted(() => {
    startCountdown()
})
onUnmounted(() => {
    stopCountDown()

})


</script>

<style>
.counter {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.counter.animate {
    transform: translateY(-1px);
}
</style>