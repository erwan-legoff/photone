<template>
    <v-data-table :items="userBackofficeStore.users">

    </v-data-table>
</template>
<script setup lang="ts">
import { useBackofficeUserStore } from '~/stores/backOfficeUserStore';

const userBackofficeStore = useBackofficeUserStore()
onMounted(() => {
    userBackofficeStore.fetchUsers();
})


</script>