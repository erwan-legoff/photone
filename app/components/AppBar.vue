<template>
    <v-app-bar color="primary">
        <template v-slot:image>
            <v-img gradient="to top right, rgba(19,84,122,.0), rgba(128,208,199,.5)"></v-img>
        </template>
        <v-app-bar-title>
            <NuxtLink to="/" class="text-white text-decoration-none font-weight-medium">
                Photone
            </NuxtLink>
        </v-app-bar-title>

        <v-btn icon>
            <v-icon>mdi-account</v-icon>
            <v-menu activator="parent" location="bottom" transition="slide-x-reverse-transition">
                <v-list>
                    <div v-if="userStore.isLogged">
                        <v-list-item @click="logout">
                            <v-list-item-title> Log Out </v-list-item-title>
                        </v-list-item>
                    </div>
                    <div v-else>
                        <v-list-item @click="navigateTo('/signup')">
                            <v-list-item-title> Sign Up </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="navigateTo('/login')">
                            <v-list-item-title> Log In </v-list-item-title>
                        </v-list-item>
                    </div>
                </v-list>
            </v-menu>
        </v-btn>
    </v-app-bar>
</template>
<script setup lang="ts">
const userStore = useUserStore()
const notificationStore = useNotificationStore()


const logout = () => {
    userStore.logout()
    navigateTo('/login')
}

</script>