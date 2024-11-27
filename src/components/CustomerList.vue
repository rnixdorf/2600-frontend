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
        <br>
        <button @click="lastFilter = '';zipFilter='';companyFilter=''">Clear Search</button>
        <button @click="listDialogVisible = true;isDialogVisible = false;">New Customer</button>
    </div>
    <p v-if="loading">Loading customers...</p>
    <p v-if="error">{{ error.message }}</p>
    <div v-if="customers.length" class="scrollable-panel">
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
    <div v-else>
      <p>No customers found</p>
    </div>
    <div v-if="listDialogVisible" class="modal-backdrop">
      <dialog class="my-dialog" open>
        <h2>New Customer</h2>
        <!-- <form @submit.prevent="newCustomer"> -->
          <!-- <button type="submit" @click="newCustomer('S');listDialogVisible = false">Subscription</button> -->
          <button type="submit" @click="isDialogVisible = true">Subscription</button>
          <button type="submit" @click="newCustomer('B');listDialogVisible = false">Back Issue</button>
          <button type="submit" @click="newCustomer('M');listDialogVisible = false">Merchandise</button>
          <button type="submit" @click="newCustomer('I');listDialogVisible = false">Info</button>
          <div >
            <IssueDialog :issueDialogVisible="isDialogVisible" :data="dialogData" @submit-issue="newSubCustomer" />
            
          </div>
          <br><br>
          <button type="button" @click="listDialogVisible = false">Cancel</button>
        <!-- </form> -->
      </dialog>
	  </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, onUnmounted } from 'vue';
  //import { RouterLink, useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useCustomerStore } from '../stores/customer'
  import { useDistributorStore } from '../stores/distributors'
  import IssueDialog from './IssueDialog.vue';
  // import { Button } from '@/components/ui/button'
  
  const emit = defineEmits(['select-customer','new-customer','submit-issue','rebuild-list']);

  defineExpose({
    rebuildSearch
  });

  const { customers, loading, error, current_issue } = storeToRefs(useCustomerStore());
  // const { distributors } = storeToRefs(useDistributorStore());
  const custStore = useCustomerStore();
  const { fetchCustomers, fetchSubTypes, getSettings, getBatch } = custStore;
  const distStore = useDistributorStore();
  const params = ref({last_name: '', zip: '', name: ''});

  const isDialogVisible = ref(false);
  const dialogData = ref({});
  
  async function rebuildSearch() {
    console.log('Rebuilding customer list');
    await fetchCustomers(params.value);
  };

  const selectCustomer = (customer) => {
    emit('select-customer', customer);
  };

  const listDialogVisible = ref(false);
  const newType = ref('');

  const newCustomer = (type) => {
    console.log("newCustomer ", dialogData);
    let cd = custStore.getSubCode(type);
    emit('new-customer', { sub_code: cd, new_type: type });
  };

  const newSubCustomer = (data) => {
    listDialogVisible.value = false;
    console.log("newSubCustomer ", data);
    let cd = custStore.getSubCode('S');
    data.tName = custStore.getSubTypeName(data.format_id);
    data.tid = data.format_id;
    data.active = 1;
    emit('new-customer', { sub_code: cd, new_type: 'S', data: data });
  };
  // const _keyListener = function(e) {
  //   console.log(e.key);
  //   if ( e.key === "n" || e.key === "N" ) {
  //       e.preventDefault(); // present "Save Page" from getting triggered.

  //       listDialogVisible.value = true
  //   }
  // };

  onMounted(async () => {
    loading.value = true;
    try {
      await getSettings();
      await fetchSubTypes();
      await fetchCustomers();
      await getBatch();
      // customers.value = custStore.customers;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }

    // const success = await custStore.fetchCustomers({});
    // if (!success) {
    //   alert("Ups, something happened 🙂", error.message);
    //   console.log("Api status ->", error.message);
    // }
    const success2 = await distStore.fetchDistributors({});
    if (!success2) {
      alert("Ups, something happened distStore 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    
    // window.addEventListener('keydown', _keyListener);
  });

  onUnmounted(() => {
    // window.removeEventListener('keydown', _keyListener);
  });

  const lastFilter = computed({
    get() {
      // console.log("in last getter");
      return params.value.name;
    },
    async set(val) {
      // console.log("in last setter ", val);
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

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .my-dialog {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 650px;
    width: 100%;
  }

  .scrollable-panel {
    flex-grow: 1; /* Take up remaining space */
    overflow-y: auto;
    /* height: calc(100vh - 180px); */
    /* max-height: calc(80vh - 80px); */
  }

  .customer-list {
    width: 200px;
    background: #f5f5f5;
    /* padding-bottom: 10px; */
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

.customer-list h2 {
  line-height: .5;
}

.customer-list ul {
  list-style-type: none;
  padding: 0;
  line-height: 1.1;
}
.customer-list li {
  cursor: pointer;
  font-size: .9em;
  /* padding: 2px; */
}
.customer-list li:hover {
  background: #ddd;
}

.customer-list button {
	background-color: lightgray;
  margin-top: 10px;
  margin-left: 20px;
	width: 120px;
	align-self: center;
	height: 30px;
	padding: 0;
  color: black;
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
  width: calc(100% - 9em);
}
</style>
