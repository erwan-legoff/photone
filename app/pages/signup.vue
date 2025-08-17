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
              @click:append-inner="showPassword = !showPassword" :hint="$t('signup.passwordRequirements')"
              persistent-hint />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="copiedPassword" type="password" :label="$t('signup.rewritePassword')"
              variant="outlined" color="primary"></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-checkbox v-model="agreements.demo" :label="$t('signup.agreements.demo')" />
          </v-col>

          <v-col cols="12">
            <v-checkbox v-model="agreements.encryption" :label="$t('signup.agreements.encryption')" />
          </v-col>

          <v-col cols="12">
            <v-checkbox v-model="agreements.lostPassword" :label="$t('signup.agreements.lostPassword')" />
          </v-col>

          <!-- <v-col cols="12">
            <v-checkbox v-model="agreements.terms" :label="$t('signup.agreements.terms')" />
          </v-col> -->

          <v-col cols="12">
            <v-btn block color="primary" class="mt-4" size="large" type="submit" :disabled="!canSubmit">
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
const agreements = reactive({
  demo: false,
  encryption: false,
  lostPassword: false,
  terms: false
})
const allAccepted = computed(() =>
  Object.values(agreements).every(Boolean)
)

const firstName = ref('')
const lastName = ref('')
const pseudo = ref('')
const email = ref('')
const password = ref('')
const copiedPassword = ref('')
const isFirstNameValid = computed(() => {
  const trimed = firstName.value.trim()
  return trimed.length > 1 && trimed.length < 60
})
const isLastNameValid = computed(() => {
  const trimed = lastName.value.trim()
  return trimed.length > 1 && trimed.length < 100
})
const isPseudoValid = computed(() => {
  const trimed = pseudo.value.trim()
  return trimed.length >= 3 && trimed.length < 30
})
const isPasswordValid = computed(() => { return password.value.length >= 6 })
const isCopiedPasswordValid = computed(() => { return password.value === copiedPassword.value })
const isEmailValid = computed(() => { return email.value.trim().length > 5 && email.value.length < 60 && email.value.includes("@") && email.value.includes(".") })
const canSubmit = computed(() => { return isFirstNameValid.value && isLastNameValid.value && isPseudoValid.value && isEmailValid.value && isPasswordValid.value && isCopiedPasswordValid.value && allAccepted.value })
const showPassword = ref(false)
// We don't want them to copy a visible password
watch(copiedPassword, () => { if (copiedPassword.value.length > 0) { showPassword.value = false } })
// If they check, they're not sure if it's the good password
watch(showPassword, () => { if (showPassword.value) { copiedPassword.value = "" } })

const createUserDto = computed<CreateUserRequestDto>(() => ({
  pseudo: pseudo.value.trim(),
  email: email.value.trim().toLowerCase(),
  rawPassword: password.value,
  name: firstName.value.trim(),
  lastName: lastName.value.trim()
}))
const userStore = useUserStore()
const submit = async () => {
  const isUserCreated: boolean = await userStore.createUser(createUserDto.value)
  const localePath = useLocalePath();
  if (isUserCreated) navigateTo(localePath({ name: 'mail-verification' }))
}

</script>