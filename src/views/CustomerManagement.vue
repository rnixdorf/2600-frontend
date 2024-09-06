<template>
    <div class="customer-management">
      <CustomerList @select-customer="handleSelectCustomer" />
      <CustomerForm :customer="selectedCustomer" @select-customer="handleSelectCustomer"/>
      <CustomerOrders :customer="selectedCustomer" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import CustomerList from '../components/CustomerList.vue';
  import CustomerForm from '../components/CustomerForm.vue';
  import CustomerOrders from '../components/CustomerOrders.vue';

  const selectedCustomer = ref(null);
  
  const handleSelectCustomer = (customer) => {
    selectedCustomer.value = customer;
  };
  </script>
  
  <style scoped>
  .customer-management {
    display: flex;
    flex-wrap:wrap; 
  }
  </style>