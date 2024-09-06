<template>
    <div class="agency-management">
      <AgencyList @select-agency="handleSelectAgency" />
      <AgencyForm :agency="selectedAgency" @select-agency="handleSelectAgency"/>
      <AgencySubscriptions :agency="selectedAgency" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import AgencyList from '../components/AgencyList.vue';
  import AgencyForm from '../components/AgencyForm.vue';
  import AgencySubscriptions from '../components/AgencySubscriptions.vue';

  const selectedAgency = ref(null);
  
  const handleSelectAgency = (agency) => {
    selectedAgency.value = agency;
  };
  </script>
  
  <style scoped>
  .agency-management {
    display: flex;
    flex-wrap:wrap; 
  }
  </style>