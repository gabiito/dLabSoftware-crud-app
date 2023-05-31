<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="q-pa-md" style="width: min(600px, 90vw);">
      <q-card-section>
        <h2 class="text-h5">Create a new product</h2>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <q-input
            v-model="name"
            label="Name"
            outlined
            :rules="[val => !!val || 'Please enter a name']"
          />

          <q-input
            class="q-my-md"
            v-model="price"
            label="Price"
            type="number"
            outlined
            :rules="[val => !!val || 'Please enter a price']"
          />

          <q-input
            class="q--md"
            v-model="imageUrl"
            label="Image URL"
            outlined
            :rules="[val => !!val || 'Please enter an image URL']"
          />

          <q-field ref="editorRef" v-model="description" outlined
          class="q-my-md"
          :rules="[val => (!!val && val !== '') || 'Description is required']" >
            <template #control>
              <q-editor
                v-model="description"
                class="full-width"
                min-height="5rem"
                max-height="10rem"
                flat
                />
            </template>
          </q-field>

          <q-card-actions align="right">
            <q-btn label="Cancel" color="primary" flat @click="closeDialog" />
            <q-btn type="submit" label="Save" color="primary"/>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-page-sticky position="bottom-right" :offset="[10, 10]">
    <q-btn fab icon="add" color="primary" @click="showNewProductDialog"/>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { createNewProduct } from 'src/services/api.service';
import { Product } from 'src/types/Product';
import { VNodeRef, ref } from 'vue';
import { useRouter } from 'vue-router';

const quasar = useQuasar();
const router = useRouter();

const showDialog = ref(false);
const name = ref('');
const price = ref(0);
const editorRef = ref<VNodeRef>();
const description = ref('');
const imageUrl = ref('');

const showNewProductDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

async function submitForm() {
  const data: Product = {
    name: name.value,
    price: price.value,
    description: description.value,
    image_url: imageUrl.value,
  };

  try {
    const result = await createNewProduct(data);
    if (result) {
      router.push(`/product/${result.id}`);
    } else {
      quasar.notify({
        message: 'Error creating product',
        type: 'negative',
        timeout: 3000,
      });
    }
  } catch (error) {
    quasar.notify({
      message: 'Error creating product',
      type: 'negative',
      timeout: 3000,
    });
  }

  closeDialog();
}

</script>
