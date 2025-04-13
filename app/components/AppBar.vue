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
        </v-btn>
    </v-app-bar>
</template>