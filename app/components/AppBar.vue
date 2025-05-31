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
        <v-btn>
            {{ locale }}

            <v-menu activator="parent" location="bottom" transition="slide-y-transition">
                <v-list>
                    <v-list-item v-for="locale in locales" @click="setLocale(locale.code)">
                        <v-list-item-title>{{ locale.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

        </v-btn>
        <v-btn icon>

            <v-icon>mdi-account</v-icon>
            <v-menu activator="parent" location="bottom" transition="slide-x-reverse-transition">
                <v-list>
                    <div v-if="userStore.isLogged">
                        <v-list-item @click="logout">
                            <v-list-item-title> {{ $t("global.logout") }} </v-list-item-title>
                        </v-list-item>
                    </div>
                    <div v-else>
                        <v-list-item @click="navigateTo(localePath({ name: 'signup' }))">
                            <v-list-item-title> {{ $t('signup.title') }} </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="navigateTo(localePath({ name: 'login' }))">
                            <v-list-item-title> {{ $t('login.title') }} </v-list-item-title>
                        </v-list-item>
                    </div>
                </v-list>
            </v-menu>
        </v-btn>
    </v-app-bar>
</template>
<script setup lang="ts">
const userStore = useUserStore()
const localePath = useLocalePath();
const { locales, setLocale, locale } = useI18n()
const logout = () => {
    userStore.logout()
    navigateTo(localePath({ name: 'login' }))
}

</script>