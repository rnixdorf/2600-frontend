<template>
    <div class="incoming-order-list">
        <h2>Orders List</h2>
        
        <p v-if="loading">Loading incoming orders...</p>
        <p v-if="error">{{ error.message }}</p>
        <div v-if="incoming-orders">
            <ul>
            <li v-for="order in incoming_orders" :key="order.id" @click="selectIncomingOrder(order)">
                {{ customer.First }} {{ customer.Last }}<br>
                <div v-if="customer.Company != ''">{{ customer.Company}}</div>
                <div>{{ customer.Address1 }}</div>
                <div v-if="customer.Address2 != ''">{{ customer.Address2}}</div>
                <div v-if="customer.Address3 != ''">{{ customer.Address3}}</div>
                <div>{{ customer.City }}, {{ customer.State }} {{ customer.Zip }}</div>
                <div v-if="customer.country != '' && customer.country != 'USA'">{{ customer.country }}</div>
                <div v-if="customer.email != ''">{{ customer.email }}</div>
                <div v-if="customer.Eformat != ''">{{ customer.Eformat }}</div>
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