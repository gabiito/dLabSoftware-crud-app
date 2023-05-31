<template>
  <q-page class="row items-center-top justify-evenly">
    <q-card flat class="my-card" v-if="loading">
      <q-skeleton height="350px" square />

      <q-card-section>
        <q-skeleton type="text" width="50%" class="text-subtitle1" />
        <q-skeleton type="text" class="text-subtitle1" />
        <q-skeleton type="text" width="80%" class="text-subtitle1" />
      </q-card-section>
    </q-card>
    <q-card flat class="my-card" v-else>
      <q-card-section>
        <q-img :src="imageUrl" fit="cover" v-if="imageUrl"/>
        <q-input
          v-model="imageUrl"
          :disable="loading"
          label="Image URL"
          filled
          class="text-white"
        >
          <template v-slot:append>
            <q-icon name="edit" color="white" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="name"
          :disable="loading"
          label="Name"
        >
          <template v-slot:append>
            <q-icon name="edit" />
          </template>
        </q-input>
        <q-input
          v-model="price"
          :disable="loading"
          label="Price"
        >
          <template v-slot:append>
            <q-icon name="edit" />
          </template>
        </q-input>
        <h2 class="text-h5">Description:</h2>
        <q-editor v-model="description" min-height="5rem" />
      </q-card-section>
    </q-card>
  </q-page>

  <q-page-sticky position="top-left" :offset="[10, 10]">
    <q-btn @click="$router.back" color="teal">
      <q-icon left size="1em" name="arrow_back_ios" />
      <div>Back</div>
    </q-btn>
  </q-page-sticky>
  <q-page-sticky position="bottom-right" :offset="[10, 10]">
    <q-fab color="purple" icon="keyboard_arrow_up" direction="up">
      <q-fab-action
        color="red-4"
        icon="delete"
        label="Delete product"
        label-position="left"
        :hide-label="hideDeleteLabel"
        external-label
        @mouseenter="hideDeleteLabel = false"
        @mouseleave="hideDeleteLabel = true"
        @click="showConfirm = true"/>
      <q-fab-action
        color="green-4"
        icon="save"
        label="Save product"
        label-position="left"
        :hide-label="hideSaveLabel"
        external-label
        @mouseenter="hideSaveLabel = false"
        @mouseleave="hideSaveLabel = true"
        @click="saveProduct"/>
    </q-fab>
  </q-page-sticky>

  <q-dialog v-model="showConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-4" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this Product?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="secondary" v-close-popup />
          <q-btn flat label="Yes, delete it" color="red-4" v-close-popup
            @click="confirmed = true"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  <div class="spinner-wrapper fullscreen" v-if="saving">
    <q-spinner-hearts
            color="green-4"
            size="5em"
          />
  </div>

</template>

<script setup lang="ts">
import { getProduct, updateProduct, deleteProduct } from 'src/services/api.service';
import { Product } from 'src/types/Product';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const id = ref(Number(route.params.id));

const loading = ref(true);
const saving = ref(false);
const showConfirm = ref(false);
const confirmed = ref(false);
const hideDeleteLabel = ref(true);
const hideSaveLabel = ref(true);

const name = ref('');
const price = ref(0);
const description = ref('');
const imageUrl = ref('');

async function getData(): Promise<void> {
  loading.value = true;
  try {
    const result = await getProduct(id.value);
    name.value = result.name;
    price.value = result.price;
    description.value = result.description;
    imageUrl.value = result.image_url;
  } catch (error) {
    router.push(`/?redirect=not-found&product=${id.value}`);
  }

  loading.value = false;
}

async function saveProduct(): Promise<void> {
  saving.value = true;

  const product: Product = {
    id: id.value,
    name: name.value,
    price: price.value,
    description: description.value,
    image_url: imageUrl.value,
  };

  const result = await updateProduct(product);

  if (result === null) {
    return;
  }

  saving.value = false;
}

function deleteProductById(): void {
  deleteProduct(id.value);
  router.push('/?redirect=deleted-successfully');
}

watch(confirmed, (value) => {
  if (value) {
    deleteProductById();
  }
});

onMounted(() => {
  getData();
});

</script>

<style scoped>
.my-card {
  width: min(900px, 80vw);
}

.spinner-wrapper {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
}

.cnt {
  position: relative;
}
</style>
