<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-sheet class="pa-6 rounded" max-width="400" elevation="6">
      <h1 class="mb-6">{{ $t("signup.page_title") }}</h1>
      <v-form @submit.prevent="submit">
        <v-row dense>
          <v-col cols="6">
            <v-text-field v-model="firstName" :label="$t('global.first_name')" variant="outlined" color="primary" />
          </v-col>

          <v-col cols="6">
            <v-text-field v-model="lastName" :label="$t('global.last_name')" variant="outlined" color="primary" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="pseudo" :label="$t('global.pseudo')" variant="outlined" color="primary" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="email" :label="$t('global.email')" variant="outlined" color="primary" clearable />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" :label="$t('signup.password')"
              variant="outlined" color="primary" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword" />
          </v-col>

          <v-col cols="12">
            <v-btn block color="primary" class="mt-4" size="large" type="submit">
              {{ $t('signup.submit') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-sheet>
  </v-container>
</template>
<script setup lang="ts">

import { useLocalePath, navigateTo } from '#imports'
definePageMeta({
  public: true
})
defineI18nRoute({
  paths: {
    fr: '/inscription',
    en: '/signup'
  }
})
import type { CreateUserRequestDto } from '~/stores/types/user/CreateUserRequestDto'
import { useUserStore } from '~/stores/userStore'

const firstName = ref('')
const lastName = ref('')
const pseudo = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const createUserDto = computed<CreateUserRequestDto>(() => ({
  pseudo: pseudo.value,
  email: email.value,
  rawPassword: password.value,
  name: firstName.value,
  lastName: lastName.value
}))
const userStore = useUserStore()
const submit = async () => {
  console.log('createUserDto:', createUserDto.value)
  const isUserCreated: boolean = await userStore.createUser(createUserDto.value)
  console.log('isUserCreated:', isUserCreated)
  const localePath = useLocalePath();
  if (isUserCreated) navigateTo(localePath({ name: 'mail-verification' }))
}

</script>