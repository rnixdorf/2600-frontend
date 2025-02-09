<template>
  <div class="dailySheet-list">
    <h2>Daily Sheet List</h2>
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

      <button @click="runSearch()">Search</button>
      <button @click="lastFilter = '';runSearch()">Clear Search</button>
        
    </div>
    <p v-if="loading">Loading daily sheets...</p>
    <p v-if="error">{{ error.message }}</p>
    <div v-if="daily_sheets && daily_sheets.length" class="scrollable-panel">
      <ul>
        <li v-for="daily_sheet in daily_sheets" :key="daily_sheet.id" @click="selectDailySheet(daily_sheet)">
          <div v-if="daily_sheet.name != ''">{{ daily_sheet.name }}</div>
          <div>Start: {{ new Date(daily_sheet.create_date).toLocaleString() }}</div>
          <div>End: {{ new Date(daily_sheet.end_date).toLocaleString() }}</div>

          <!-- <div v-if="customer.Eformat != ''">{{ customer.Eformat }}</div> -->
          <hr>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No daily sheets found</p>
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
  
  const emit = defineEmits(['select-dailySheet','rebuild-dailySheet-list']);

  defineExpose({
    rebuildSearch
  });

  const { loading, error, daily_sheets } = storeToRefs(useCustomerStore());
  // const { distributors } = storeToRefs(useDistributorStore());
  const custStore = useCustomerStore();
  const { getDailySheets } = custStore;
  const distStore = useDistributorStore();
  const params = ref({name: ''});

  const isDialogVisible = ref(false);
  const dialogData = ref({});
  
  async function rebuildSearch() {
    // console.log('Rebuilding daily sheet list');
    await getDailySheets(params.value);
  };

  const selectDailySheet = (daily_sheet) => {
    emit('select-dailySheet', daily_sheet);
  };

  const listDialogVisible = ref(false);
  const newType = ref('');


  onMounted(async () => {
    loading.value = true;
    try {
      await getDailySheets();
      // customers.value = custStore.customers;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }

  });

  onUnmounted(() => {
    // window.removeEventListener('keydown', _keyListener);
  });

  const runSearch = async () => {
    await getDailySheets(params.value);
  };

  const lastFilter = computed({
    get() {
      // console.log("in last getter");
      return params.value.name;
    },
    async set(val) {
      params.value.name = val;
      // console.log("params: ", params.value);
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

  .dailySheet-list {
    width: 200px;
    background: #f5f5f5;
    /* padding-bottom: 10px; */
    flex: .75;
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

.dailySheet-list h2 {
  line-height: .5;
}

.dailySheet-list ul {
  list-style-type: none;
  padding: 0;
  line-height: 1.1;
}
.dailySheet-list li {
  cursor: pointer;
  font-size: .9em;
  /* padding: 2px; */
}
.dailySheet-list li:hover {
  background: #ddd;
}

.dailySheet-list button {
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
