<template>
    <div class="incoming-order-management">
      <IncomingOrderList @select-incoming-order="handleSelectIncomingOrder" />
      <IncomingOrderDisplay :incoming_order="selectedIncomingOrder" @select-incoming-order="handleSelectIncomingOrder"/>
      <!-- <CustomerOrders :incoming_order="selectedIncomingOrder" /> -->
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import IncomingOrderList from '../components/IncomingOrderList.vue';
  import IncomingOrderDisplay from '../components/IncomingOrderDisplay.vue';
//   import CustomerOrders from '../components/CustomerOrders.vue';

  const selectedIncomingOrder = ref(null);
  
  const handleSelectIncomingOrder = (incoming_order) => {
    selectedIncomingOrder.value = incoming_order;
  };
  </script>
  
  <style scoped>
  .incoming-order-management {
    display: flex;
    flex-wrap:wrap; 
  }
  </style>