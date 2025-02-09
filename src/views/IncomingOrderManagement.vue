<template>
    <div class="incoming-order-management">
      <IncomingOrderList @select-incoming-order="handleSelectIncomingOrder" />
      <IncomingOrderDisplay :order="selectedIncomingOrder" @select-incoming-order="handleSelectIncomingOrder"/>
      <IncomingOrderMatching :order="selectedIncomingOrder" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import IncomingOrderList from '../components/IncomingOrderList.vue';
  import IncomingOrderDisplay from '../components/IncomingOrderDisplay.vue';
  import IncomingOrderMatching from '../components/IncomingOrderMatching.vue';
//   import CustomerOrders from '../components/CustomerOrders.vue';

  const selectedIncomingOrder = ref(null);
  
  const handleSelectIncomingOrder = (incoming_order) => {
    selectedIncomingOrder.value = incoming_order;
  };
  </script>
  
<style scoped>
  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
  }
  .incoming-order-management {
    display: flex;
    height: calc(100vh - 125px);
  }
</style>