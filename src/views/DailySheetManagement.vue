<template>
    <div class="dailySheet-management">
      <DailySheetList ref="dailySheetList" @select-dailySheet="handleSelectDailySheet" />
      <DailySheetItems :dailySheet="selectedDailySheet" @select-dailySheet="handleSelectDailySheet" @rebuild-dailySheet-list="rebuildList"/>
      <!-- <CustomerOrders :dailySheet="selectedDailySheet" /> -->
      <!-- <MemoDialog :visible="isDialogVisible" @close-memo="closeDialog" @submit="handleDialogSubmit">
        <p>Dialog content goes here</p>
      </MemoDialog> -->
    </div>
  </template>
    
  <script setup>
    import { ref, onMounted } from 'vue';
    import DailySheetList from '../components/DailySheetList.vue';
    import DailySheetItems from '../components/DailySheetItems.vue';
    // import CustomerOrders from '../components/CustomerOrders.vue';
    // import MemoDialog from '../components/MemoDialog.vue';
  
    const selectedDailySheet = ref(null);
    // const isDialogVisible = ref(false);
    const dailySheetList = ref(null);
    
    onMounted(() => {
        dailySheetList.value.rebuildSearch();
    });
  
    const rebuildList = () => {
      console.log('Rebuilding daily sheet list');
      if (dailySheetList.value) {
        dailySheetList.value.rebuildSearch();
      }
    };
  
    const handleSelectDailySheet = (dailySheet) => {
        selectedDailySheet.value = dailySheet;
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
  
    .dailySheet-management {
    display: flex;
    /* flex-direction: column; */
    height: calc(100vh - 125px);
  }
    /* .dailySheet-management {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
      height: 82vh; 
    } */
    </style>