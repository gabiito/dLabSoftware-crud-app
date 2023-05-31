<template>
  <q-page class="row items-center justify-evenly">
    <product-list></product-list>
    <new-product></new-product>
  </q-page>
</template>

<script setup lang="ts">
import ProductList from 'src/components/ProductList.vue';
import NewProduct from 'src/components/NewProduct.vue';

</script>
