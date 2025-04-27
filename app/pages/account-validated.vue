<template>
    <v-container>
        <v-sheet class="pa-4 text-center mx-auto" elevation="12" max-width="600" rounded="lg" width="100%">
            <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>

            <h2 class="text-h5 mb-6">Account validated !</h2>

            <p class="mb-4 text-medium-emphasis text-body-2">
                Your email account has been successfully validated !

                <br>

                You can now log into your account by clicking on the "Log in" button.
            </p>

            <v-divider class="mb-4"></v-divider>

            <div class="text-end">
                <v-btn @click="navigateTo('/login')" class="text-none" color="primary" variant="flat" width="90"
                    rounded>
                    Log in
                </v-btn>
            </div>
        </v-sheet>
    </v-container>
</template>
<script setup lang="ts">



</script>