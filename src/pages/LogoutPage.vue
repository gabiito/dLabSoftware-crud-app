<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 q-my-lg">¡¡ See you next time !!</h5>
      </div>
      <div class="row">
        <q-btn @click="$router.push('/')" color="teal">
          <q-icon left size="1em" name="arrow_back_ios" />
          <div>Take me back home!</div>
          <q-icon right size="1em" name="arrow_forward_ios" />
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';

const authStore = useAuthStore();

setTimeout(() => {
  authStore.logout();
}, 3000);

</script>

<style>

.q-card {
  width: min(360px, 90vw);
}
</style>
