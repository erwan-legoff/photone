<template>
    <v-sheet elevation="2" rounded class="pa-4">
        <v-toolbar flat color="transparent" class="px-0">
            <v-toolbar-title class="text-h6">User Backoffice</v-toolbar-title>
            <v-spacer />
        </v-toolbar>

        <v-data-table :headers="headers" :items="userBackofficeStore.users" :sort-by="sortBy" item-value="id"
            class="elevation-1" density="compact" hover :items-per-page="10"
            :footer-props="{ itemsPerPageOptions: [5, 10, 20], showFirstLastPage: true }">
            <template v-slot:item.status="{ value }">
                <v-chip :color="statusColor(value)" text-color="white" label size="small">
                    {{ value }}
                </v-chip>
            </template>

            <template v-slot:item.createdAt="{ value }">
                {{ formatDate(value) }}
            </template>

            <template v-slot:item.modifiedAt="{ value }">
                {{ formatDate(value) }}
            </template>

            <template v-slot:item.deletedAt="{ value }">
                {{ formatDate(value) }}
            </template>

            <template v-slot:item.actions="{ item }">
                <div class="d-flex gap-2 justify-end">
                    <v-tooltip text="Send Email Verification">
                        <template #activator="{ props }">
                            <v-icon v-bind="props" icon="mdi-mail" color="primary" size="small"
                                @click="userBackofficeStore.sendVerifyEmailUser(item.id)" />
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Validate account">
                        <template #activator="{ props }">
                            <v-icon v-bind="props" icon="mdi-check-circle" color="success" size="small"
                                @click="userBackofficeStore.validateUserAccount(item.id)" />
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Block user">
                        <template #activator="{ props }">
                            <v-icon v-bind="props" icon="mdi-block-helper" color="error" size="small"
                                @click="userBackofficeStore.blockUser(item.id)" />
                        </template>
                    </v-tooltip>

                    <v-tooltip text="Unblock user">
                        <template #activator="{ props }">
                            <v-icon v-bind="props" icon="mdi-restore" color="info" size="small"
                                @click="userBackofficeStore.unblockUser(item.id)" />
                        </template>
                    </v-tooltip>
                </div>
            </template>
        </v-data-table>
    </v-sheet>
</template>

<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'
import type { SortItem } from 'vuetify/lib/components/VDataTable/composables/sort.mjs'
import { useBackofficeUserStore } from '~/stores/backofficeUserStore'

const userBackofficeStore = useBackofficeUserStore()

onMounted(() => {
    userBackofficeStore.fetchUsers()
})

const sortBy: Ref<SortItem[]> = ref([{ key: 'modifiedAt', order: 'desc' }])

const headers: DataTableHeader[] = [
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'Pseudo', key: 'pseudo' },
    { title: 'Name', key: 'name' },
    { title: 'Last Name', key: 'lastName' },
    { title: 'Email', key: 'email' },
    { title: 'Role', key: 'role' },
    { title: 'Status', key: 'status' },
    { title: 'Created At', key: 'createdAt' },
    { title: 'Modified At', key: 'modifiedAt' },
    { title: 'Deleted At', key: 'deletedAt' },
    { title: 'Media Count', key: 'mediaCount' },
    { title: 'Actions', key: 'actions', sortable: false }
]

const formatDate = (date: string): string => {
    try {
        return new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(date))
    } catch {
        return date
    }
}

const statusColor = (status: string): string => {
    switch (status) {
        case 'BLOCKED_BY_ADMIN':
            return 'red'
        case 'CREATED':
            return 'grey'
        case 'EMAIL_VALIDATED':
            return 'blue'
        case 'VALIDATED_BY_ADMIN':
            return 'green'
        default:
            return 'grey'
    }
}
</script>