<template>
  <div class="customer-management">
    <CustomerList @select-customer="handleSelectCustomer" @new-customer="handleNewCustomer"/>
    <CustomerForm :customer="selectedCustomer" @select-customer="handleSelectCustomer" @open-memo="handleOpenDialog"/>
    <CustomerOrders :customer="selectedCustomer" />
    <MemoDialog :visible="isDialogVisible" @close-memo="closeDialog" @submit="handleDialogSubmit">
      <p>Dialog content goes here</p>
    </MemoDialog>
  </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import CustomerList from '../components/CustomerList.vue';
  import CustomerForm from '../components/CustomerForm.vue';
  import CustomerOrders from '../components/CustomerOrders.vue';
  import MemoDialog from '../components/MemoDialog.vue';

  const selectedCustomer = ref(null);
  const isDialogVisible = ref(false);
  
  const handleSelectCustomer = (customer) => {
    selectedCustomer.value = customer;
  };

  const handleNewCustomer = (customer) => {
    selectedCustomer.value = {};
  };

  const openDialog = () => {
    isDialogVisible.value = true;
  };

  const closeDialog = () => {
    isDialogVisible.value = false;
  };

  const handleOpenDialog = (data) => {
    console.log('Data from CustomerForm:', data);
    // Handle the data as needed
    openDialog();
  };
  
  const handleDialogSubmit = (data) => {
    console.log('Data from dialog:', data);
    // Handle the data as needed
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