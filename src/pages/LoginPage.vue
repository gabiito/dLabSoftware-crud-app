<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 q-my-md">dLab Software</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md"
              @reset="resetForm"
              @submit.prevent="login">
              <q-input outlined
                v-model="email"
                type="email"
                :rules="emailRules"
                label="E-mail"/>
              <q-input outlined
                v-model="password"
                :type="isPwd ? 'password' : 'text'"
                :rules="passwordRules"
                label="Password">
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-card-actions class="q-px-md">
                <q-btn unelevated color="light-green-7" size="lg" class="full-width"
                  label="Login"
                  type="submit"
                  :loading="loading"
                  />
              </q-card-actions>
            </q-form>
          </q-card-section>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Not reigistered? Create an Account</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { loginUser } from 'src/services/api.service';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const authStore = useAuthStore();

const quasar = useQuasar();

const emailRules = [
  (value: string) => !!value || 'E-mail is required',
  (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid',
];

const isPwd = ref(true);
const passwordRules = [
  (value: string) => !!value || 'Password is required',
  (value: string) => value.length >= 8 || 'Password must be at least 8 characters',
];

if (authStore.isLoggedIn) {
  const router = useRouter();
  router.push('/');
}

function resetForm(): void {
  email.value = '';
  password.value = '';
  isPwd.value = true;
}

async function login(): Promise<void> {
  loading.value = true;
  const response = await loginUser(email.value, password.value);
  if (response) {
    authStore.login({
      token: response.access,
      refresh: response.refresh,
      email: email.value,
    });
  } else {
    quasar.notify({
      message: 'User name or password is incorrect!',
      color: 'deep-orange-5',
      type: 'negative',
      position: 'top',
      timeout: 3000,
    });
  }
  loading.value = false;
}

</script>

<style>

.q-card {
  width: min(360px, 90vw);
}
</style>
