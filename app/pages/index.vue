<template>
  <v-container fluid class="pa-8 min-h-screen">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-6 pa-md-10 rounded-lg shadow-lg">
          <div class="text-center mb-12">
            <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
              {{ $t('home_page.title') }}
            </h1>
            <p class="text-h6 font-weight-regular">
              {{ $t('home_page.subtitle') }}
            </p>
          </div>

          <v-alert type="info" variant="tonal" border="start" density="compact" class="mb-8 rounded" icon="mdi-wrench">
            <span class="font-weight-medium">{{ $t('home_page.note') }}</span> {{ $t('home_page.noteContent') }}
          </v-alert>

          <section class="text-center mb-10">
            <h2 class="text-h5 font-weight-semibold mb-6">
              {{ $t('home_page.contactTitle') }}
            </h2>
            <div class="d-flex justify-center flex-wrap ga-4">
              <v-btn to="/photos" color="primary" size="large" rounded="lg" class="text-none">
                {{ $t('home_page.goToPhotos') }}
              </v-btn>
              <v-btn href="mailto:rw4nit0@gmail.com" color="secondary" size="large" rounded="lg" class="text-none" prepend-icon="mdi-email-fast">
                {{ $t('home_page.sendMail') }}
              </v-btn>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-h5 font-weight-semibold mb-4 border-b pb-2">
              <v-icon start icon="mdi-account-eye" />
              {{ $t('home_page.projectTitle') }}
            </h2>
            <p class="text-body-1 leading-relaxed">
              {{ $t('home_page.projectDesc1') }}
            </p>
            <p class="text-body-1 mt-3 leading-relaxed">
              {{ $t('home_page.projectDesc2') }}
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-h5 font-weight-semibold mb-4 border-b pb-2">
              <v-icon start icon="mdi-code-tags" />
              {{ $t('home_page.techTitle') }}
            </h2>
            <div class="d-flex flex-wrap ga-2">
              <v-chip color="primary" variant="flat" prepend-icon="mdi-language-java">{{ $t('home_page.techSpring')
                }}</v-chip>
              <v-chip color="primary" variant="flat" prepend-icon="mdi-nuxt">{{ $t('home_page.techNuxt') }}</v-chip>
              <v-chip color="primary" variant="flat" prepend-icon="mdi-vuetify">{{ $t('home_page.techVuetify')
                }}</v-chip>
              <v-chip color="primary" variant="flat" prepend-icon="mdi-tailwind">{{ $t('home_page.techTailwind')
                }}</v-chip>
              <v-chip color="primary" variant="flat" prepend-icon="mdi-security">{{ $t('home_page.techJWT') }}</v-chip>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-h5 font-weight-semibold mb-4 border-b pb-2">
              <v-icon start icon="mdi-cogs" />
              {{ $t('home_page.featuresTitle') }}
            </h2>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="text-h6 font-weight-medium mb-3">
                  <v-icon start icon="mdi-check-circle" color="success" />
                  {{ $t('home_page.featuresDone') }}
                </h3>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item prepend-icon="mdi-upload">{{ $t('home_page.featureUpload') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-database-lock">{{ $t('home_page.featureStorage') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-image-multiple">{{ $t('home_page.featureDisplay') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-api">{{ $t('home_page.featureApi') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-account-plus">{{ $t('home_page.featureSignup') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-security">{{ $t('home_page.featureAuth') }}</v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" md="6">
                <h3 class="text-h6 font-weight-medium mb-3">
                  <v-icon start icon="mdi-progress-wrench" color="warning" />
                  {{ $t('home_page.featuresPlanned') }}
                </h3>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item prepend-icon="mdi-key-variant">{{ $t('home_page.featureReset') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-email-check">{{ $t('home_page.featureMail') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-shield-lock">{{ $t('home_page.featureEncrypt') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-folder-multiple-image">{{ $t('home_page.featureAlbums')
                    }}</v-list-item>
                  <v-list-item prepend-icon="mdi-account-group">{{ $t('home_page.featureGroups') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-share-variant">{{ $t('home_page.featureShare') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-tag-multiple">{{ $t('home_page.featureTags') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-sync">{{ $t('home_page.featureSync') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-desktop-mac-dashboard">{{ $t('home_page.featureDesktop')
                    }}</v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </section>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  public: true
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.v-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.2);
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.v-list-item {
  padding-left: 0 !important;
}

.v-list-item :deep(.v-list-item__prepend) .v-icon {
  margin-inline-end: 12px !important;
  opacity: 0.9;
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(3, 218, 198, 0.5);
}

.text-secondary {
  color: rgb(var(--v-theme-secondary));
}
</style>