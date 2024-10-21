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
          <button class="small-button" type="submit" @click="renewSubDialog(subscription.id,subscription.expiration,subscription.email);" title="Renew">
            <Icon :icon="iconAdd" />
          </button>
          <button class="small-button" type="submit" @click="editSubDialog(subscription.id,subscription.expiration,subscription.email);" title="Edit">
            <Icon :icon="iconEdit" />
          </button>
          <button v-if="!subscription.cancelled" type="submit" @click="cancelSubDialog(subscription.id,subscription.expiration);" class="small-button-red" title="Cancel">
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
            <br>
          </span>
          <!-- <span v-else> {{ order.source_name }} Order</span> -->
          <!-- <br> -->
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
        <h2 v-if="isCancelled" class="error">Cancel Subscription</h2>
        <h2 v-else-if="renew_id > 0">Renew Subscription</h2>
        <h2 v-else>New Subscription</h2>
        <!-- <form @submit.prevent="newCustomer"> -->
          <div v-if="!isCancelled">
            <div v-if="renew_id <= 0">
              <span v-for="(subType, index) in sub_types" :key="index">
                <input type="radio" :id="subType" :value="subType.id" v-model="format_id">
                <label :for="subType">{{ subType.name }}</label>
              </span>
              <br><br>
            </div>
            <button type="submit" @click="setYears(1);">1 Year</button>
            <button type="submit" @click="setYears(2);">2 Years</button>
            <button type="submit" @click="setYears(3);">3 Years</button>
            <button type="submit" @click="setYears(99);">Lifetime</button>
            <br><br>
            <label for="years">Years: </label>
            <input type="number" id="years" v-model="years" min="-3" max="100" class="always-show-spinner">
            <label for="issues">&emsp;Issues: </label>
            <input type="number" id="issues" v-model="issues" min="-3" max="100" class="always-show-spinner">
            <br><br>
            <span v-if="renew_id > 0">Current Exp: {{ exp }}</span>
            <span>&emsp;New Exp: {{ newExp }}</span>
          
            <br><br>
            <div v-if="!isCancelled">
              <label for="email">Email: </label>
              <input type="text" id="sub_email" v-model="sub_email" class="sub_email" tabindex="-1">
            </div>
          </div>
          <label for="memo">Memo: </label>
          <textarea id="memo" v-model="memo" class="memo-textarea"></textarea>
          <br v-if="memoError">
          <span v-if="memoError" class="error">{{ memoError }}</span>
          <br><br>
          <button v-if="isCancelled" type="submit" @click="cancelSubscription();" :disabled="isMemoEmpty">Cancel Subscription</button>
          <button v-else-if="renew_id > 0" type="submit" @click="renewSubscription(newExp);" :disabled="isMemoEmpty">Renew</button>
          <button v-else type="submit" @click="newSubscription(newExp);" :disabled="isMemoEmpty">New {{ selectedSubTypeName }}</button>
          <button type="button" @click="listDialogVisible = false;memo = '';isCancelled = false;">Cancel</button>
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
import { email } from '@vuelidate/validators';

  const memo = ref('');
  const memoError = ref('');
  const iconAdd = ref('mdi:refresh');
  const iconCancel = ref('mdi:close');
  const iconEdit = ref('mdi:invoice-text-edit-outline');
  const listDialogVisible = ref(false);
  const isCancelled = ref(false);
  const years = ref(0);
  const issues = ref(0);
  const renew_id = ref(0);
  const exp = ref("");
  const format_id = ref(1);
  const sub_email = ref("");
  const custStore = useCustomerStore();
  const { orders, subscriptions, sub_types, error, current_issue } = storeToRefs(useCustomerStore());
  const newExp = computed(() => {
    if(!exp.value) return "";
    if (years.value == 99) return "5Q99";
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

  const isMemoEmpty = computed(() => !memo.value);

  const selectedSubTypeName = computed(() => {
    const selectedSubType = sub_types.value.find(subType => subType.id === format_id.value);
    return selectedSubType ? selectedSubType.name : '';
  });

  const cancelSubDialog = async (sub_id, expire) => {
    console.log("cancelSubDialog: ", sub_id);
    isCancelled.value = true;
    years.value = 0;
    issues.value = 0;
    renew_id.value = sub_id;
    exp.value = expire;
    listDialogVisible.value = true;
  }

  const renewSubDialog = async (sub_id,expire,email) => {
    // console.log("renew Sub: ", sub_id);
    years.value = 0;
    issues.value = 0;
    renew_id.value = sub_id;
    exp.value = expire;
    if( email != undefined || email == null)
      sub_email.value = selectedCustomer.value.email;
    else
      sub_email.value = email;
    listDialogVisible.value = true;
  }

  const newSubDialog = async () => {
    // console.log("new Sub: ");
    years.value = 1;
    issues.value = 0;
    renew_id.value = -1;
    format_id.value = 1;
    exp.value = current_issue.value;
    sub_email.value = selectedCustomer.value.email;
    listDialogVisible.value = true;
  }

  const validateMemo = () => {
    if (!memo.value) {
      memoError.value = 'Memo is required';
      return false;
    }
    memoError.value = '';
    return true;
  };

  const newSubscription = async (newExp) => {
    if (!validateMemo()) return;
    console.log("newSubscription: ", selectedCustomer.value.id, newExp, format_id.value, memo.value);
    let success = await DataService.updateSubscription(0, 
      { expiration: newExp, 
        active: true, 
        cancelled: false, 
        memo: memo.value, 
        active: true,
        email: sub_email.value,
        fk_customers_id: selectedCustomer.value.id, 
        fk_subscription_types_id: format_id.value
      }
    );
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    else
    {
      await processOrder();
      await custStore.getCustomerSubscriptionsById(selectedCustomer.value.id);
      memo.value = '';
      listDialogVisible.value = false;
    }
    
  }

  const renewSubscription = async (newExp) => {
    if (!validateMemo()) return;
    console.log("renewSubscription: ", renew_id.value, newExp, memo.value);
    let success = await DataService.updateSubscription(renew_id.value, { email: sub_email.value, expiration: newExp, active: true, cancelled: false });
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    else
    {
      await processOrder();
      await custStore.getCustomerSubscriptionsById(selectedCustomer.value.id);
      memo.value = '';
      listDialogVisible.value = false;
    }
    
  }

  const cancelSubscription = async () => {
    if (!validateMemo()) return;
    console.log("cancelSubscription: ", renew_id.value, memo.value);
    let success = await DataService.updateSubscription(renew_id.value, { active: false, cancelled: true });
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    else
    {
      await processOrder();
      await custStore.getCustomerSubscriptionsById(selectedCustomer.value.id);
      memo.value = '';
      listDialogVisible.value = false;
      isCancelled.value = false;
    }
    
  }

  const processOrder = async () => {
    console.log("processOrder");
    let dt = new Date();
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    let success = await DataService.insertCustomerOrder(
      { fk_customers_id: selectedCustomer.value.id,
        fk_order_sources_id: 3,
        fk_order_types_id: 6,
        enter_date: dt.toISOString().slice(0, 19).replace('T', ' '),
        memo: memo.value,
      });
    if (!success) {
      alert("Ups, something happened 🙂", error.message);
      console.log("Api status ->", error.message);
    }
    // else
    // {
    //   await custStore.getCustomerSubscriptionsById(selectedCustomer.value.id);
    // }

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

  .memo-textarea {
    width: 100%;
    height: 100px;
    resize: vertical; /* Allow vertical resizing */
  }
  .error {
    color: red;
  }
  .sub_email {
    width: 75%;
  }
</style>
  