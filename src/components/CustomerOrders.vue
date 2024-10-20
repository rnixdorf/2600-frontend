<template>
  <div class="customer-orders" v-if="selectedCustomer">
    <h2>Subscriptions for {{ selectedCustomer.last }}</h2>
    <ul v-if="subscriptions.length > 0">
      <div style="display: inline-block;">
        <li v-for="(subscription) in subscriptions" :key="subscription.id">
          <button class="small-button" type="submit" @click="newSubDialog();" title="Renew">
            New Sub
          </button>
          <br>
          <button class="small-button" type="submit" @click="renewSubDialog(subscription.id,subscription.expiration);" title="Renew">
            <Icon :icon="iconAdd" />
          </button>
          <button v-if="!subscription.cancelled" type="submit" @click="cancelSub(subscription.id);" class="small-button-red" title="Cancel">
            <Icon :icon="iconCancel" />
          </button>
          <span>&nbsp;Exp: {{ subscription.expiration }}</span>
          <span>&emsp;Type: {{ subscription.subtype }}</span>
          <span v-if="subscription.lifetime==1">&emsp;Lifetime</span>
          <span v-else-if="subscription.free">&emsp;Free</span>
          <span v-else-if="subscription.cancelled" style="color: red">&emsp;Cancelled</span>
          <span v-else-if="!subscription.active" style="color: red">&emsp;Expired</span>
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
  <div v-if="listDialogVisible" class="modal-backdrop">
      <dialog class="my-dialog" open>
        <h2 v-if="renew_id > 0">Renew Subscription</h2>
        <h2 v-else>New Subscription</h2>
        <!-- <form @submit.prevent="newCustomer"> -->
          <div v-if="renew_id < 0">
            <span v-for="(subType, index) in sub_types" :key="index">
              <input type="radio" :id="subType" :value="subType.id" v-model="format_id">
              <label :for="subType">{{ subType.name }}</label>
            </span>
            <br><br>
          </div>
          <button type="submit" @click="setYears(1);listDialogVisible = true">1 Year</button>
          <button type="submit" @click="setYears(2);listDialogVisible = true">2 Years</button>
          <button type="submit" @click="setYears(3);listDialogVisible = true">3 Years</button>
          <br><br>
          <label for="years">Years: </label>
          <input type="number" id="years" v-model="years" min="-3" max="100" class="always-show-spinner">
          <label for="issues">&emsp;Issues: </label>
          <input type="number" id="issues" v-model="issues" min="-3" max="100" class="always-show-spinner">
          <br><br>
          <span v-if="renew_id > 0">Current Exp: {{ exp }}</span>
          <span>&emsp;New Exp: {{ newExp }}</span>
          <br><br>
          <button v-if="renew_id > 0" type="submit" @click="renewSubscription(newExp);listDialogVisible = false">Renew</button>
          <button v-else type="submit" @click="newSubscription(newExp);listDialogVisible = false">New</button>
          <button type="button" @click="listDialogVisible = false">Cancel</button>
        <!-- </form> -->
      </dialog>
	  </div>
</template>
<!-- https://admin.shopify.com/store/2600-magazine/orders/ -->
<script setup>
  import { ref, watch, reactive, computed } from 'vue';
  import { storeToRefs } from 'pinia'
  import { useCustomerStore } from '../stores/customer'
  import { Icon } from '@iconify/vue';
  import DataService from "../services/data-service.js";

  const iconAdd = ref('mdi:refresh');
  const iconCancel = ref('mdi:close');
  const listDialogVisible = ref(false);
  const years = ref(0);
  const issues = ref(0);
  const renew_id = ref(0);
  const exp = ref("");
  const format_id = ref(0);
  const custStore = useCustomerStore();
  const { orders, subscriptions, sub_types, error, current_issue } = storeToRefs(useCustomerStore());
  const newExp = computed(() => {
    if(!exp.value) return "";
    let addIssues = issues.value + (years.value * 4);
    const [quarter, year] = exp.value.split('Q').map(Number);
    let newQuarter = quarter + addIssues;
    let newYear = year;
    while (newQuarter > 4) {
      newQuarter -= 4;
      newYear++;
    }
    while (newQuarter < 1) {
      newQuarter += 4;
      newYear--;
    }

    return `${newQuarter}Q${newYear}`;
  });
  

  const props = defineProps({
    customer: {
      type: Object,
      required: false
    }
  });

  const cancelSub = async (sub) => {
    console.log("cancelSub: ", sub);
    let success = await DataService.updateSubscription(sub, { cancelled: true });
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    else
    {
      await custStore.getCustomerSubscriptionsById(selectedCustomer.value.id);
    }
  }

  const renewSubDialog = async (sub_id,expire) => {
    console.log("renew Sub: ", sub_id);
    years.value = 0;
    issues.value = 0;
    renew_id.value = sub_id;
    exp.value = expire;
    listDialogVisible.value = true;
  }

  const newSubDialog = async () => {
    console.log("new Sub: ");
    years.value = 0;
    issues.value = 0;
    renew_id.value = -1;
    format_id.value = 1;
    // exp.value = expire;
    listDialogVisible.value = true;
  }

  const newSubscription = async (newExp) => {
    console.log("newSubscription: ", selectedCustomer.value.id, newExp, format_id.value);
    // let success = await DataService.updateSubscription(selectedCustomer.value.id, { expiration: newExp, active: true, cancelled: false });
    // if (!success) {
    //   alert("Ups, something happened 🙂", error.message);
    //   console.log("Api status ->", error.message);
    // }
    // else
    // {
    //   await custStore.getCustomerSubscriptionsById(selectedCustomer.value.id);
    // }
  }

  const renewSubscription = async (newExp) => {
    console.log("renewSubscription: ", renew_id.value, newExp);
    let success = await DataService.updateSubscription(renew_id.value, { expiration: newExp, active: true, cancelled: false });
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    else
    {
      await custStore.getCustomerSubscriptionsById(selectedCustomer.value.id);
    }
  }

  const setYears = (yr) => {
    years.value = yr;
  };
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
    height: calc(100vh - 280px);
  }
  .customer-orders h2 {
    line-height: .2;
  }
  .customer-orders {
    width: 200px;
    background: #f5f5f5;
    padding-left: 5px;
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
    line-height: 1;
    display: inline-block;
  }
  .customer-orders li {
    padding: 5px;
  }
  .floatleft {
    float:left;
  }
  .small-button {
    padding: 1px;
    background-color: green;
    border: none;
    border-radius: 20%;
    color: white;
    margin-right:.4em;
    margin-bottom: .5em;
  }
  .small-button:hover {
    background-color: darkgreen;
  }
  .small-button-red {
    padding: 1px;
    background-color: red;
    border: none;
    border-radius: 20%;
    color: white;
    margin-right:.4em;
  }
  .small-button-red:hover {
    background-color: darkred;
  }

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

  .my-dialog button {
    background-color: lightgray;
    margin-left: 20px;
  }

  .my-dialog input[type="radio"] {
    margin-left: 20px;
  }

  .always-show-spinner::-webkit-inner-spin-button,
  .always-show-spinner::-webkit-outer-spin-button {
    opacity: 1;
  }
</style>
  