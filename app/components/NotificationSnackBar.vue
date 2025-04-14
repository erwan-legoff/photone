<template>
    <v-snackbar-queue v-model="notifications.messages" />
</template>

<script setup lang="ts">


const notifications = useNotificationStore()
</script>