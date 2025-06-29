<template>
  <v-container fluid class="pa-8 min-h-screen">
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
        <v-btn href="mailto:rw4nit0@gmail.com" color="secondary" size="large" rounded="lg" class="cta-btn text-none"
          prepend-icon="mdi-email-fast">
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

    <!-- Tech stack (GRID) -->
    <section class="mb-12">
      <h2 class="text-h5 font-weight-semibold mb-6 border-b pb-2 d-flex align-center">
        <v-icon start icon="mdi-code-tags" />
        {{ $t('home_page.tech.title') }}
      </h2>

      <div class="tech-grid">
        <div v-for="cat in categories" :key="cat.key" class="tile" :style="tileStyles[cat.key]"
          @mousemove="(e) => throttledMove(e, cat.key)" @mouseleave="() => onTileLeave(cat.key)">
          <v-icon :icon="cat.icon" size="42" class="mb-3" />
          <h3 class="text-h6 font-weight-medium mb-4">
            {{ $t(`home_page.tech.${cat.key}.title`) }}
          </h3>
          <div class="d-flex flex-wrap justify-center ga-3">
            <v-chip v-for="item in cat.items" :key="item.key" size="large" color="primary" variant="flat"
              :prepend-icon="item.icon" class="tech-chip px-5 py-3">
              {{ $t(`home_page.tech.${cat.key}.${item.key}`) }}
            </v-chip>
          </div>
        </div>
      </div>
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
            <v-list-item prepend-icon="mdi-email-check">{{ $t('home_page.features.mail') }}</v-list-item>
            <v-list-item prepend-icon="mdi-shield-lock">{{ $t('home_page.features.encrypt') }}</v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="6">
          <h3 class="text-h6 font-weight-medium mb-3">
            <v-icon start icon="mdi-progress-wrench" color="warning" />
            {{ $t('home_page.features.planned') }}
          </h3>
          <v-list density="compact" class="bg-transparent">
            <v-list-item prepend-icon="mdi-folder-multiple-image">{{ $t('home_page.features.albums') }}</v-list-item>
            <v-list-item prepend-icon="mdi-account-group">{{ $t('home_page.features.groups') }}</v-list-item>
            <v-list-item prepend-icon="mdi-share-variant">{{ $t('home_page.features.share') }}</v-list-item>
            <v-list-item prepend-icon="mdi-tag-multiple">{{ $t('home_page.features.tags') }}</v-list-item>
            <v-list-item prepend-icon="mdi-sync">{{ $t('home_page.features.sync') }}</v-list-item>
            <v-list-item prepend-icon="mdi-desktop-classic">{{ $t('home_page.features.desktop') }}</v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useMouse, useThrottleFn } from '@vueuse/core'

// basic mouse position
const { x, y } = useMouse()
// wrap move handler in throttle to reduce CPU
const throttledMove = useThrottleFn(onTileMove, 50)

const categories = [
  { key: 'frameworks', icon: 'mdi-cube-outline', items: [{ key: 'spring', icon: 'mdi-language-java' }, { key: 'nuxt', icon: 'mdi-nuxt' }] },
  { key: 'security', icon: 'mdi-shield-lock', items: [{ key: 'jwt', icon: 'mdi-security' }, { key: 'bcrypt', icon: 'mdi-lock-reset' }, { key: 'roleMgmt', icon: 'mdi-account-key' }, { key: 'webCryptoApi', icon: 'mdi-web' }] },
  { key: 'languages', icon: 'mdi-code-tags', items: [{ key: 'java', icon: 'mdi-language-java' }, { key: 'typescript', icon: 'mdi-language-typescript' }] },
  { key: 'otherBack', icon: 'mdi-server', items: [{ key: 'springDataJpa', icon: 'mdi-database' }, { key: 'lombok', icon: 'mdi-file-code' }, { key: 'awsS3', icon: 'mdi-cloud' }] },
  { key: 'otherFrontend', icon: 'mdi-web', items: [{ key: 'pinia', icon: 'mdi-pin' }, { key: 'i18n', icon: 'mdi-translate' }] },
  { key: 'testing', icon: 'mdi-flask', items: [{ key: 'mockito', icon: 'mdi-flask-outline' }, { key: 'junit', icon: 'mdi-test-tube' }] }
]

const tileStyles = reactive(
  Object.fromEntries(categories.map(c => [c.key, { '--rfl-x': '-75%', '--rfl-y': '-50%' }]))
)

function onTileMove(e: MouseEvent, key: string) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  tileStyles[key] = {
    '--rfl-x': `${x.value - rect.left}px`,
    '--rfl-y': `${y.value - rect.top}px`
  }
}

function onTileLeave(key: string) {
  tileStyles[key] = { '--rfl-x': '-75%', '--rfl-y': '-50%' }
}

definePageMeta({ public: true })
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
  background: var(--v-theme-surface);
}

.tech-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
}

.tile {
  position: relative;
  padding: 2rem;
  border-radius: 1rem;
  background: var(--v-theme-background);
  box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--rfl-x, -75%);
  width: 50%;
  height: 100%;
  transform: translateX(-50%) skewX(-25deg);
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transition: left 0.6s ease;
}

.tile::after {
  content: '';
  position: absolute;
  top: var(--rfl-y, -50%);
  left: var(--rfl-x, -50%);
  transform: translate(-50%, -50%) rotate(45deg);
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(var(--v-theme-primary), 0.18), transparent 70%);
  transition: top 0.2s ease, left 0.2s ease;
  pointer-events: none;
}

.tech-chip {
  font-size: 0.9rem;
  transition: transform 0.2s, background-color 0.2s;
}

.tech-chip:hover {
  transform: scale(1.1);
  background-color: rgba(var(--v-theme-accent), 0.15) !important;
}

.cta-btn {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 6px 18px rgba(3, 218, 198, 0.5);
}
</style>