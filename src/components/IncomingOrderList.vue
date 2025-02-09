<template>
  <div class="incoming-order-list">
      <h2>Unprocessed Orders ({{ incoming_orders.length }})</h2>
      
      <p v-if="loading">Loading incoming orders...</p>
      <p v-if="error">{{ error.message }}</p>
      <div v-if="incoming_orders" class="scrollable-panel">
          <ul>
            <li v-for="order in incoming_orders" :key="order.id" @click="selectIncomingOrder(order)">
              {{ order.order_json.customer.first_name + " " + order.order_json.customer.last_name }}
              {{ order.order_id }}
              <br>
              {{ new Date(order.order_date).toLocaleString() }}
              <hr>
            </li>
          </ul>
      </div>
      <div v-else>
      <p>No Orders found</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, reactive } from 'vue';
  //import { RouterLink, useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useCustomerStore } from '../stores/customer'

  const emit = defineEmits(['select-incoming-order']);

  const { customers, incoming_orders, loading, error } = storeToRefs(useCustomerStore());
  const custStore = useCustomerStore();
  const params = ref({last_name: '', zip: '', name: ''});

  const selectIncomingOrder = (incoming_order) => {
    emit('select-incoming-order', incoming_order);
  };

  onMounted(async () => {
    const success = await custStore.fetchIncomingOrders();
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
  });
  // const lastFilter = computed({
  //   get() {
  //     console.log("in last getter");
  //     return params.value.name;
  //   },
  //   async set(val) {
  //     console.log("in last setter ", val);
  //     // custStore.last_name = val;
  //     // console.log("in setter ", custStore.last_name);
  //     // custStore.filterCustomer();
  //     params.value.name = val;
  //     console.log("params: ", params.value);
  //     await custStore.fetchCustomers(params.value);
  //   }
  // });
  // const zipFilter = computed({
  //   get() {
  //     // console.log("in zip getter");
  //     return params.value.zip;
  //   },
  //   async set(val) {
  //     // console.log("in zip setter ", val);
  //     params.value.zip = val;
  //     await custStore.fetchCustomers(params.value);
  //   }
  // });
  // const companyFilter = computed({
  //   get() {
  //     // console.log("in zip getter");
  //     return params.value.company;
  //   },
  //   async set(val) {
  //     // console.log("in zip setter ", val);
  //     params.value.company = val;
  //     await custStore.fetchCustomers(params.value);
  //   }
  // });
</script>

<style scoped>
  .scrollable-panel {
    flex-grow: 1; /* Take up remaining space */
    overflow-y: auto;
    /* height: calc(100vh - 180px); */
    /* max-height: calc(80vh - 80px); */
  }

  .incoming-order-list {
    width: 200px;
    background: #f5f5f5;
    /* padding-bottom: 10px; */
    flex: 1;
    font-weight: bold;
    display: flex;
    flex-direction: column;
  }


  .incoming-order-list h2 {
    line-height: .5;
  }

  .incoming-order-list ul {
    list-style-type: none;
    padding: 0;
    line-height: 1.1;
  }
  .incoming-order-list li {
    cursor: pointer;
    font-size: .9em;
    /* padding: 2px; */
  }
  .incoming-order-list li:hover {
    background: #ddd;
  }

  .incoming-order-list button {
    background-color: lightgray;
    margin-top: 10px;
    margin-left: 20px;
    width: 120px;
    align-self: center;
    height: 30px;
    padding: 0;
    color: black;
  }
</style>