<template>
  <div class="agency-list">
    <h2>Agency List</h2>
    <div class="searchInputs">
      <label class="searchLabel">Company</label>
      <input
            name="companySearch"
            class="search-field textfield-closed"
            type="search"
            placeholder="Search Company Name" 
            v-model="companyFilter"
        />
    </div>
    <p v-if="loading">Loading Agencies...</p>
    <p v-if="error">{{ error.message }}</p>
    <div v-if="distributors" class="scrollable-panel">
      <ul>
        <li v-for="agency in distributors" :key="agency.id" @click="selectAgency(agency)">
          <div v-if="agency.company != ''">{{ agency.company}}</div>
          <div>{{ agency.address1 }}</div>
          <div v-if="agency.address2 != ''">{{ agency.address2}}</div>
          <div v-if="agency.address3 != ''">{{ agency.address3}}</div>
          <div>{{ agency.city }}, {{ agency.state }} {{ agency.zip }}</div>
          <div v-if="agency.country != '' && agency.country != 'USA'">{{ agency.country }}</div>
          <div v-if="agency.email != ''">{{ agency.email }}</div>
          <hr>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, reactive } from 'vue';
  //import { RouterLink, useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useDistributorStore } from '../stores/distributors'

  const emit = defineEmits(['select-agency']);

  // const { customers, loading, error } = storeToRefs(useCustomerStore());
  const { distributors } = storeToRefs(useDistributorStore());
  // const custStore = useCustomerStore();
  const distStore = useDistributorStore();
  const params = ref({company: ''});


  const selectAgency = (agency) => {
    emit('select-agency', agency);
  };

  onMounted(async () => {
    const success2 = await distStore.fetchDistributors({});
    if (!success2) {
      alert("Ups, something happened distStore 🙂", error.message);
      console.log("Api status ->", error.message);
    }
  });
  

  const companyFilter = computed({
    get() {
      // console.log("in zip getter");
      return params.value.company;
    },
    async set(val) {
      // console.log("in zip setter ", val);
      params.value.company = val;
      await distStore.fetchDistributors(params.value);
    }
  });
</script>

<style scoped>
  .scrollable-panel {
    max-height: 350px; /* Adjust as needed */
    overflow-y: auto;
  }
.agency-list {
  width: 200px;
  background: #f5f5f5;
  padding: 10px;
  flex: 1;
  font-weight: bold;
}
.agency-list ul {
  list-style-type: none;
  padding: 0;
}
.agency-list li {
  cursor: pointer;
  padding: 5px;
}
.agency-list li:hover {
  background: #ddd;
}
.searchLabel {
  display: inline-block;
  /* font-size: 1.2em; */
  font-weight: bold;
  width: 5em;
}

.searchInputs {
  text-align: left;
}
.search-field {
  width: 12em;
}
</style>
