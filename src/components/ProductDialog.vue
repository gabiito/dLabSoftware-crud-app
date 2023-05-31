<template>
  <q-dialog v-model="show">
    <q-card class="q-pa-md" style="width: min(500px, 90vw);">
      <q-card-section>
        <h2 class="text-h5">{{ product?.name }}</h2>
      </q-card-section>
      <q-card-section>
        <q-img :src="product?.image_url" height="250px" :ratio="16/9" cover/>
      </q-card-section>
      <q-card-section>
        <div class="price">
          <q-icon name="attach_money" color="green-4" size="2em"/>
          <span>{{ product?.price }}</span>
        </div>
        <div class="description">
          <h3 class="text-h5">Description</h3>
          <div class="description-data" v-html="product?.description">
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { Product } from 'src/types/Product';

const show = ref(false);

const props = defineProps({
  product: {
    type: null as unknown as PropType<Product | null>,
    required: true,
  },
});

const emit = defineEmits(['close']);

watch(() => props.product, () => {
  show.value = !!props.product;
});

watch(() => show.value, () => {
  if (!show.value) {
    emit('close');
  }
});

</script>

<style scoped>
.description-data {
  max-height: 200px;
  overflow-y: auto;
}
</style>
