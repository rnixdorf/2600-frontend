<template>
    <div class="hope-management">
      <HopeList @select-hope="handleSelectHope" />
      <HopeTicket :ticket="selectedHope" />
      <HopeOrders :ticket="selectedHope" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import HopeList from '../components/HopeList.vue';
  import HopeTicket from '../components/HopeTicket.vue';
  import HopeOrders from '../components/HopeOrders.vue';

  const selectedHope = ref(null);
  
  const handleSelectHope = (ticket) => {
    selectedHope.value = ticket;
  };
  </script>
  
  <style scoped>
  .hope-management {
    display: flex;
    flex-wrap:wrap; 
  }
  </style>