<template>
  <v-dialog v-model="dialogVisible" persistent width="400">
    <v-card>
      <v-card-title class="text-h5">
        <v-icon start icon="mdi-lock" />
        {{ $t("pin.enter") }}
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="pin" :append-icon="showPin ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPin ? 'text' : 'password'" label="PIN" :placeholder="$t('pin.enter')"
          @click:append="showPin = !showPin" @keyup.enter="submit" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="!canSubmit" color="primary" :loading="props.loading" @click="submit">
          {{ $t("pin.validate") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">

const pin = ref('')
const showPin = ref(false)
const canSubmit = (): boolean => {
  if (!pin.value) return false
  if (pin.value.length < 4) return false

  return true
}

const submit = () => {
  emit('submit:pin', pin.value)
}

const props = defineProps<{
  needsPin: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:needPin', value: boolean): void
  (e: 'close'): void
  (e: 'submit:pin', pin: string): void
}>()

const dialogVisible = computed({
  get: () => props.needsPin,
  set: (value) => emit('update:needPin', value)
})
</script>