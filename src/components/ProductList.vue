<template>
  <q-page class="row items-center-top justify-evenly q-mb-lg">
    <h1 class="text-h2">Product List</h1>
    <q-table
      :rows="products"
      row-key="id"
      v-model:columns="columns"
      :rows-per-page-options="[10]"
      v-model:pagination="pagination"
      :loading="loading"
      flat
      no-data-label="There are no products available"
      @request="onRequest"
      class="q-mt-md q-mb-xl products-table">
        <template v-slot:body-cell-action="{ row }">
          <q-td key="actions" align="center">
            <q-icon
              name="delete"
              color="red-4"
              size="sm"
              class="q-mx-xs"
              @click="deleteProductById(row.id)"
            />
            <q-icon
              name="edit"
              color="teal-4"
              size="sm"
              class="q-mx-xs"
              @click="$router.push(`/product/${row.id}`)"
              />
              <q-icon
              name="visibility"
              color="green-4"
              size="sm"
              class="q-mx-xs"
              @click="viewProductById(row.id)"
            />
          </q-td>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </q-page>
    <product-dialog
      v-model:show="showDialog"
      :product="product"
      @close="closeDialog"
    />
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getAllProducts, deleteProduct } from 'src/services/api.service';
import { Product } from 'src/types/Product';
import ProductDialog from './ProductDialog.vue';
import { RequestProps, ColumnsDefinition, NotifyConfig } from './models';

const columns = ref(ColumnsDefinition);

const quasar = useQuasar();
const route = useRoute();
const router = useRouter();
const page = ref(Number(route.query.page) || 1);

const products = ref<Product[]>([]);
const loading = ref(true);
const showDialog = ref(false);
const product = ref<Product | null>(null);

const notifyMessagesConfig = <NotifyConfig> {
  'not-found': {
    message: `Product with id: ${route.query.product}, was not found!`,
    color: 'deep-orange-5',
  },
  'created-successfully': {
    message: 'Product created successfully',
    color: 'orange-4',
  },
  'deleted-successfully': {
    message: 'Product deleted successfully',
    color: 'red-5',
  },
};

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

async function onRequest(props?: RequestProps): Promise<Product[]> {
  loading.value = true;

  page.value = props ? props.pagination.page : 1;
  const data = await getAllProducts(page.value);

  if (!data) return [];

  products.value = data.results;

  pagination.value.page = page.value;
  pagination.value.rowsNumber = data.count;

  loading.value = false;

  return data.results;
}

async function deleteProductById(id: number | undefined) {
  if (!id) return;

  loading.value = true;

  await deleteProduct(id);

  loading.value = false;
  router.push('/?redirect=deleted-successfully');
}

function viewProductById(id: number | undefined) {
  if (!id) return;

  product.value = products.value.find((p) => p.id === id) || null;

  if (product.value) {
    showDialog.value = true;
  }
}

function closeDialog() {
  showDialog.value = false;
  product.value = null;
}

function notify(redirectValue: string): void {
  if (redirectValue && notifyMessagesConfig[redirectValue] !== undefined) {
    const { message, color } = notifyMessagesConfig[redirectValue];

    quasar.notify({
      message,
      color,
      position: 'top-right',
      timeout: 3000,
    });

    onRequest({ pagination: { page: page.value } });
    router.push('/');
  }
}

onMounted(async () => {
  await onRequest({ pagination: { page: page.value } });
  notify(route.query.redirect as string);
});

watch(() => route.query, async () => {
  const redirectValue = route.query.redirect as string;
  notify(redirectValue);
});

</script>

<style scoped>
.products-table {
  width: min(100%, 1000px);
}

.q-icon {
  cursor: pointer;
}
</style>
