<template>
  <div class="customer-list">
    <h2>Customer List</h2>
    <div class="searchInputs">
      <label class="searchLabel">Name</label>
      <input
            name="lastNameSearch"
            class="search-field textfield-closed"
            type="search"
            placeholder="Search Name" 
            v-model="lastFilter"
        />
      <br>
      <label class="searchLabel">Zipcode</label>
      <input
          name="zipcodeSearch"
          class="search-field textfield-closed"
          type="search"
          placeholder="Search Zipcode" 
          v-model="zipFilter"
      />
      <br>
      <label class="searchLabel">Company</label>
      <input
            name="companySearch"
            class="search-field textfield-closed"
            type="search"
            placeholder="Search Company" 
            v-model="companyFilter"
        />
    </div>
    <p v-if="loading">Loading customers...</p>
    <p v-if="error">{{ error.message }}</p>
    <div v-if="customers" class="scrollable-panel">
      <ul>
        <li v-for="customer in customers" :key="customer.id" @click="selectCustomer(customer)">
          {{ customer.first }} {{ customer.last }}<br>
          <div v-if="customer.company != ''">{{ customer.company}}</div>
          <div>{{ customer.address1 }}</div>
          <div v-if="customer.address2 != ''">{{ customer.address2}}</div>
          <div v-if="customer.address3 != ''">{{ customer.address3}}</div>
          <div>{{ customer.city }}, {{ customer.state }} {{ customer.zip }}</div>
          <div v-if="customer.country != '' && customer.country != 'USA'">{{ customer.country }}</div>
          <div v-if="customer.email != ''">{{ customer.email }}</div>
          <!-- <div v-if="customer.Eformat != ''">{{ customer.Eformat }}</div> -->
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
  import { useCustomerStore } from '../stores/customer'
  import { useDistributorStore } from '../stores/distributors'

  const emit = defineEmits(['select-customer']);

  const { customers, loading, error } = storeToRefs(useCustomerStore());
  // const { distributors } = storeToRefs(useDistributorStore());
  const custStore = useCustomerStore();
  const distStore = useDistributorStore();
  const params = ref({last_name: '', zip: '', name: ''});


  const selectCustomer = (customer) => {
    emit('select-customer', customer);
  };

  onMounted(async () => {
    const success = await custStore.fetchCustomers({});
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    const success2 = await distStore.fetchDistributors({});
    if (!success2) {
      alert("Ups, something happened distStore 🙂", error.message);
      console.log("Api status ->", error.message);
    }
  });
  
  const lastFilter = computed({
    get() {
      console.log("in last getter");
      return params.value.name;
    },
    async set(val) {
      console.log("in last setter ", val);
      // custStore.last_name = val;
      // console.log("in setter ", custStore.last_name);
      // custStore.filterCustomer();
      params.value.name = val;
      console.log("params: ", params.value);
      await custStore.fetchCustomers(params.value);
    }
  });
  const zipFilter = computed({
    get() {
      // console.log("in zip getter");
      return params.value.zip;
    },
    async set(val) {
      // console.log("in zip setter ", val);
      params.value.zip = val;
      await custStore.fetchCustomers(params.value);
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
      await custStore.fetchCustomers(params.value);
    }
  });
</script>

<style scoped>

  .scrollable-panel {
    flex-grow: 1; /* Take up remaining space */
    overflow-y: auto;
    /* max-height: calc(80vh - 80px); */
  }

  .customer-list {
    width: 200px;
    background: #f5f5f5;
    padding: 10px;
    flex: 1;
    font-weight: bold;
    display: flex;
    flex-direction: column;
  }
  /* .scrollable-panel {
    max-height: 64vh; 
    overflow-y: auto;
  } */
/* .customer-list {
  width: 200px;
  background: #f5f5f5;
  padding: 10px;
  flex: 1;
  font-weight: bold;
}  */
.customer-list ul {
  list-style-type: none;
  padding: 0;
  line-height: 1.2;
}
.customer-list li {
  cursor: pointer;
  padding: 2px;
}
.customer-list li:hover {
  background: #ddd;
}
.searchLabel {
  display: inline-block;
  /* font-size: 1.2em; */
  font-weight: bold;
  width: 5em;
  margin-left: 20px;
}

.searchInputs {
  text-align: left;
  margin-bottom: 10px;
  margin-left: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f5f5;
  /* display: flex; */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
}
.search-field {
  width: 12em;
}
</style>
