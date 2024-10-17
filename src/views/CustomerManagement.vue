<template>
    <div class="customer-management">
      <CustomerList @select-customer="handleSelectCustomer" @new-customer="handleNewCustomer"/>
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

  const handleNewCustomer = (customer) => {
    selectedCustomer.value = {};
  };

  </script>
  
  <style scoped>
  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
  }

  .customer-management {
  display: flex;
  /* flex-direction: column; */
  height: calc(100vh - 125px);
}
  /* .customer-management {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    height: 82vh; 
  } */
  </style>