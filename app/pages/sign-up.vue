<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-sheet class="pa-6 rounded" max-width="400" elevation="6">
      <h1 class="mb-6">Create your account</h1>
      <v-form @submit.prevent="submit">
        <v-row dense>
          <v-col cols="6">
            <v-text-field v-model="firstName" label="First name" variant="outlined" color="primary" />
          </v-col>

          <v-col cols="6">
            <v-text-field v-model="lastName" label="Last name" variant="outlined" color="primary" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="pseudo" label="Pseudo" variant="outlined" color="primary" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="email" label="Email" variant="outlined" color="primary" clearable />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Password"
              variant="outlined" color="primary" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword" />
          </v-col>

          <v-col cols="12">
            <v-btn block color="primary" class="mt-4" size="large" type="submit">
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-sheet>
  </v-container>
</template>
<script setup lang="ts">
import type { CreateUserRequestDto } from '~/stores/types/CreateUserRequestDto'
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
  userStore.createUser(createUserDto.value)
}

</script>