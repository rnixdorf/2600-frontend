<template>
  <div class="hope-orders" v-if="selectedHope">
  </div>
  <div class="hope-orders" v-if="!selectedHope"></div>
</template>

<script setup>
import { ref } from 'vue';

const selectedHope = ref(null);

const props = defineProps({
  ticket: {
    type: Object,
    required: false
  }
});



</script>

<style scoped>
  .hope-orders {
    width: 200px;
    background: #f5f5f5;
    padding: 10px;
    flex: 1;
  }
  .hope-orders ul {
    list-style-type: none;
    padding: 0;
  }
  .hope-orders li {
    padding: 5px;
  }
</style>