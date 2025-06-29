<template>
  <v-container fluid class="pa-8 min-h-screen">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-6 pa-md-10 rounded-lg shadow-lg tech-container">
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
              {{ $t('home_page.title') }}
            </h1>
            <p class="text-h6 font-weight-regular">
              {{ $t('home_page.subtitle') }}
            </p>
          </div>

          <!-- Dev note -->
          <v-alert type="info" variant="tonal" border="start" density="compact" class="mb-8 rounded" icon="mdi-wrench">
            <span class="font-weight-medium">{{ $t('home_page.note') }}</span>
            {{ $t('home_page.noteContent') }}
          </v-alert>

          <!-- CTA -->
          <section class="text-center mb-10">
            <h2 class="text-h5 font-weight-semibold mb-6">
              {{ $t('home_page.contactTitle') }}
            </h2>
            <div class="d-flex justify-center flex-wrap ga-4">
              <v-btn to="/photos" color="primary" size="large" rounded="lg" class="cta-btn text-none">
                {{ $t('home_page.openApplication') }}
              </v-btn>
              <v-btn href="mailto:rw4nit0@gmail.com" color="secondary" size="large" rounded="lg"
                class="cta-btn text-none" prepend-icon="mdi-email-fast">
                {{ $t('home_page.sendMail') }}
              </v-btn>
            </div>
          </section>

          <!-- Project overview -->
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

          <!-- Tech stack -->
          <section class="mb-12">
            <h2 class="text-h5 font-weight-semibold mb-6 border-b pb-2">
              <v-icon start icon="mdi-code-tags" />
              {{ $t('home_page.tech.title') }}
            </h2>

            <v-row class="ga-6">
              <v-col v-for="cat in categories" :key="cat.key" cols="12" sm="6" md="4">
                <v-sheet class="tech-card pa-6 rounded-xl text-center d-flex flex-column align-center justify-start"
                  @mousemove="onCardMouseMove($event, cat.key)" @mouseleave="onCardMouseLeave(cat.key)"
                  :style="cardStyles[cat.key]">
                  <v-icon :icon="cat.icon" size="42" class="mb-3" />
                  <h3 class="text-h6 font-weight-medium mb-5">
                    {{ $t(`home_page.tech.${cat.key}.title`) }}
                  </h3>
                  <div class="d-flex flex-wrap justify-center ga-4">
                    <v-chip v-for="item in cat.items" :key="item.key" color="primary" variant="flat"
                      :prepend-icon="item.icon" class="tech-chip py-4 px-6">
                      {{ $t(`home_page.tech.${cat.key}.${item.key}`) }}
                    </v-chip>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </section>

          <!-- Features -->
          <section class="mb-10">
            <h2 class="text-h5 font-weight-semibold mb-4 border-b pb-2">
              <v-icon start icon="mdi-cogs" />
              {{ $t('home_page.features.title') }}
            </h2>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="text-h6 font-weight-medium mb-3">
                  <v-icon start icon="mdi-check-circle" color="success" />
                  {{ $t('home_page.features.done') }}
                </h3>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item prepend-icon="mdi-upload">{{ $t('home_page.features.upload') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-database-lock">{{ $t('home_page.features.storage') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-image-multiple">{{ $t('home_page.features.display') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-api">{{ $t('home_page.features.api') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-account-plus">{{ $t('home_page.features.signup') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-security">{{ $t('home_page.features.auth') }}</v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <h3 class="text-h6 font-weight-medium mb-3">
                  <v-icon start icon="mdi-progress-wrench" color="warning" />
                  {{ $t('home_page.features.planned') }}
                </h3>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item prepend-icon="mdi-key-variant">{{ $t('home_page.features.reset') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-email-check">{{ $t('home_page.features.mail') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-shield-lock">{{ $t('home_page.features.encrypt') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-folder-multiple-image">{{ $t('home_page.features.albums')
                  }}</v-list-item>
                  <v-list-item prepend-icon="mdi-account-group">{{ $t('home_page.features.groups') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-share-variant">{{ $t('home_page.features.share') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-tag-multiple">{{ $t('home_page.features.tags') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-sync">{{ $t('home_page.features.sync') }}</v-list-item>
                  <v-list-item prepend-icon="mdi-desktop-mac-dashboard">{{ $t('home_page.features.desktop')
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
import { reactive, toRefs } from 'vue'

const categories = [
  {
    key: 'frameworks', icon: 'mdi-cube-outline', items: [
      { key: 'spring', icon: 'mdi-language-java' },
      { key: 'nuxt', icon: 'mdi-nuxt' }
    ]
  },
  {
    key: 'styling', icon: 'mdi-palette', items: [
      { key: 'vuetify', icon: 'mdi-vuetify' },
      { key: 'tailwind', icon: 'mdi-tailwind' }
    ]
  },
  {
    key: 'security', icon: 'mdi-shield-lock', items: [
      { key: 'jwt', icon: 'mdi-security' },
      { key: 'bcrypt', icon: 'mdi-lock-reset' },
      { key: 'roleMgmt', icon: 'mdi-account-key' },
      { key: 'webCryptoApi', icon: 'mdi-web' }
    ]
  },
  {
    key: 'languages', icon: 'mdi-code-tags', items: [
      { key: 'java', icon: 'mdi-language-java' },
      { key: 'typescript', icon: 'mdi-language-typescript' }
    ]
  },
  {
    key: 'otherBack', icon: 'mdi-server', items: [
      { key: 'springDataJpa', icon: 'mdi-database' },
      { key: 'lombok', icon: 'mdi-file-code' },
      { key: 'awsS3', icon: 'mdi-cloud' }
    ]
  },
  {
    key: 'otherFrontend', icon: 'mdi-web', items: [
      { key: 'pinia', icon: 'mdi-pin' },
      { key: 'i18n', icon: 'mdi-translate' }
    ]
  },
  {
    key: 'testing', icon: 'mdi-flask', items: [
      { key: 'mockito', icon: 'mdi-flask-outline' },
      { key: 'junit', icon: 'mdi-test-tube' }
    ]
  }
]

// reactive styles per card
const cardStyles = reactive({})
categories.forEach(cat => cardStyles[cat.key] = {})

function onCardMouseMove(e, key) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  cardStyles[key] = {
    '--rfl-x': x + 'px',
    '--rfl-y': y + 'px'
  }
}
function onCardMouseLeave(key) {
  cardStyles[key] = {}
}

definePageMeta({ public: true })
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
  background: var(--v-theme-surface);
}

.v-card {
  background: var(--v-theme-background);
}

/* CTA buttons */
.cta-btn {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 6px 18px rgba(3, 218, 198, 0.5);
}

/* Tech cards style: subtle sheen + hover reflection */
.tech-card {
  position: relative;
  background: var(--v-theme-surface);
  overflow: hidden;
  /* subtle default sheen */
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.05);
}

.tech-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--rfl-x, -75%);
  transform: translateX(-50%) skewX(-25deg);
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transition: left 0.1s ease;
}

.tech-card::after {
  content: '';
  position: absolute;
  top: var(--rfl-y, -50%);
  left: var(--rfl-x, -50%);
  transform: translate(-50%, -50%) scale(1) rotate(45deg);
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(var(--v-theme-primary), 0.2), transparent 70%);
  pointer-events: none;
}

/* Chips inside tech cards */
.tech-chip {
  font-size: 0.9rem;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.tech-chip:hover {
  transform: scale(1.1);
  background-color: rgba(var(--v-theme-accent), 0.15) !important;
}

/* List custom padding */
.v-list-item {
  padding-left: 0 !important;
}

.v-list-item :deep(.v-list-item__prepend) .v-icon {
  margin-inline-end: 12px !important;
  opacity: 0.9;
}
</style>
