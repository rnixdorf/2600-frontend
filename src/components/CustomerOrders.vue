<template>
  <div class="customer-orders" v-if="selectedCustomer">
    <h2>Subscriptions for {{ selectedCustomer.last }}</h2>
    <ul v-if="subscriptions.length > 0">
      <div style="display: inline-block;">
        <li v-for="(subsciption, index) in subscriptions" :key="subsciption.id">
          <span>Type: {{ subsciption.subtype }}</span>
          <span>&emsp;Exp: {{ subsciption.expiration }}</span>
          <span v-if="subsciption.lifetime==1">&emsp;Lifetime</span>
          <span v-else-if="subsciption.free">&emsp;Free</span>
        </li>
      </div>
    </ul>
    <span v-else>No subscriptions found</span>
    <hr>
    <h2>Orders for {{ selectedCustomer.last }}</h2>
    <ul v-if="orders.length > 0">
      <div style="display: inline-block;" class="scrollable-panel">
        <li v-for="(order, index) in orders" :key="order.id">
          <span v-if="order.source_name == 'Shopify' && (order.order_num !== state.previousOrderNum || index === 0)"> {{ order.source_name }} Order Number: 
            <a v-if="order.web_ref" :href="`https://admin.shopify.com/store/2600-magazine/orders/${order.web_ref}`" target="_blank" title="Open order in new tab">
              {{ order.order_num }}
            </a>
            <span v-else>{{ order.order_num }}</span>
          </span>
          <span v-else> {{ order.source_name }} Order</span>
          <br>
          <span v-if="order.order_date != null">Order Date:&emsp;{{ (new Date(order.order_date)).toLocaleDateString() }}<br></span>
          Entry Date: &emsp;{{ (new Date(order.enter_date)).toLocaleDateString() }}
          <br>
          Memo: {{ order.memo }}
          <br>
          <ul class="lines" v-if="order.order_lines && order.order_lines.length > 0" >
            <div class="floatleft">
              <li v-for="line in order.order_lines" :key="line.line_id">
                Item: {{ line.item }}, Qty: {{ line.quantity }}
              </li>
            </div>
          </ul>
          <hr>
        </li>
      </div>
    </ul>
    <span v-else>No Orders found</span>
  </div>
  <div class="customer-orders" v-if="!selectedCustomer"></div>
</template>
<!-- https://admin.shopify.com/store/2600-magazine/orders/ -->
<script setup>
  import { ref, watch, reactive, computed } from 'vue';
  import { storeToRefs } from 'pinia'
  import { useCustomerStore } from '../stores/customer'
  const custStore = useCustomerStore();
  const { orders, subscriptions, error } = storeToRefs(useCustomerStore());

  const props = defineProps({
    customer: {
      type: Object,
      required: false
    }
  });

  //const orders = reactive([]);
  const selectedCustomer = ref(null);
  let state = reactive({
    previousOrderNum: null,
  });
  watch(
    () => props.customer,
    async (newVal) => {
      // console.log("o newVal: ", newVal);
      if (newVal) {
        selectedCustomer.value = { ...newVal };
        // fetchOrders(newVal.id);
        // console.log("newval.id: ", newVal.id)
        const success = await custStore.getCustomerOrdersById(newVal.id);
        if (!success) {
          alert("Ups, something happened 🙂", error.message);
          console.log("Api status ->", error.message);
        }
        await custStore.getCustomerSubscriptionsById(newVal.id);
        // console.log("here",orders.value);
        // console.log("here2",customers.value);
      }
      else {
        selectedCustomer.value = null;
      }
    }
  );
  
  watch(orders, (newVal) => {
    // console.log("order newVal: ", newVal);
    // console.log("order newVal.length: ", newVal.length);
    // console.log("state.previousOrderNum: ", state.previousOrderNum);
    if (newVal.length > 0) {
      state.previousOrderNum = newVal[0].order_num;
    }
    // else if (newVal.length == 0) {
    //   selectedCustomer.value = null;
    //   console.log("sc:",selectedCustomer.value);
    // }
  }, { deep: true });

</script>
  
<style scoped>
  .scrollable-panel {
    flex-grow: 1; /* Take up remaining space */
    overflow-y: auto;
    height: calc(100vh - 430px);
  }
  .customer-orders {
    width: 200px;
    background: #f5f5f5;
    padding: 10px;
    flex: 1;
    text-align: left;
    font-weight: bold;
  }
  .customer-orders ul {
    list-style-type: none;
    padding: 0;
    line-height: 1.5;
  }
  .customer-orders ul.lines {
    list-style-type: none;
    padding: 0;
    line-height: .6;
    display: inline-block;
  }
  .customer-orders li {
    padding: 5px;
  }
  .floatleft {
    float:left;
  }
</style>
  