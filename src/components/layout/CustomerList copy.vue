<script setup>
  import { RouterLink, useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useCustomerStore } from '../stores/customer'
  import { onMounted, ref } from "vue";
  import  CustomerEdit from './CustomerForm.vue'
  

  const { customers, loading, error } = storeToRefs(useCustomerStore());
  const custStore = useCustomerStore();
  // const { fetchCustomers, filterCustomer } = storeToRefs(custStore);
  import { computed, reactive } from "vue";
  // const lastSearch = ref(custStore.last_name);
  // const lastSearch = ref();
  const route = useRoute();
  const customer = ref(null);
  const params = ref({last_name: '', zip: ''});
  onMounted(async () => {
    const success = await custStore.fetchCustomers();
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    // console.log("mounted customers: ",lastFilter("LOGGINS"));
  });
  const lastFilter = computed({
    get() {
      console.log("in last getter");
      return params.value.last_name;
    },
    async set(val) {
      console.log("in last setter ", val);
      // custStore.last_name = val;
      // console.log("in setter ", custStore.last_name);
      // custStore.filterCustomer();
      params.value.last_name = val;
      console.log("params: ", params.value);
      await custStore.fetchCustomers(params.value);
    }
  });
  const zipFilter = computed({
    get() {
      console.log("in zip getter");
      return params.value.zip;
    },
    async set(val) {
      console.log("in zip setter ", val);
      params.value.zip = val;
      await custStore.fetchCustomers(params.value);
    }
  });
</script>

<template>
  <div class="container">
    <div class="left-panel">Left Panel
      <br>
      <div class="searchInputs">
        <label class="searchLabel">Lastname 
        <input
              name="lastNameSearch"
              class="search-field textfield-closed"
              type="search"
              placeholder="Search Last Name" 
              v-model="lastFilter"
          />
        </label>
        <label class="searchLabel">Zipcode 
        <input
              name="zipcodeSearch"
              class="search-field textfield-closed"
              type="search"
              placeholder="Search Zipcode" 
              v-model="zipFilter"
          />
        </label>
      </div>
      <p v-if="loading">Loading customers...</p>
      <p v-if="error">{{ error.message }}</p>
      <div v-if="customers">
        <ul>
        <li v-for="customer in customers" :key="customer.id" @click="selectCustomer(customer)" style="text-align: left;">
          <router-link :to="`/customer/${customer.id}`">
            <!-- {{ customer.id }}<br> -->
            {{ customer.First }} {{ customer.Last }}<br>
            <div v-if="customer.Company != ''">{{ customer.Company}}</div>
            {{ customer.Address1 }}<br>
            <div v-if="customer.Address2 != ''">{{ customer.Address2}}</div>
            <div v-if="customer.Address3 != ''">{{ customer.Address3}}</div>
            <div>{{ customer.City }}, {{ customer.State }} {{ customer.Zip }}</div>
            <div v-if="customer.country != '' && customer.country != 'USA'">{{ customer.country }}</div>
            <div v-if="customer.email != ''">{{ customer.email }}</div>
          </router-link>
          <hr>
        </li>
      </ul>
      </div>
    </div>
    <main class="main-panel">
      <router-view></router-view>
    </main>
    <div class="right-panel">Right Panel</div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
}

.searchLabel {
  display: block;
  /* font-size: 1.2em; */
  font-weight: bold;
}

.searchInputs {
  text-align: left;
}

.right-panel {
  flex: 2;
  padding: 1em;
  border: 1px solid #ccc;
}

.left-panel {
  flex: 1.5;
  padding: 1em;
  border: 1px solid #ccc;
}

.main-panel {
  flex: 3;
  padding: 1em;
  border: 1px solid #ccc;
}
</style>