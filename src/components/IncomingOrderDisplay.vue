<template>
  <div class="incoming-order-display">
    <div v-if="selectedIncomingOrder">
      <h2>View Order</h2>
      <h2>{{ selectedIncomingOrder.first_name + " " + selectedIncomingOrder.last_name }}</h2>
      <form @submit.prevent="updateCustomer">
        <!-- <div style="display: inline-block;">
          <button type="submit" :disabled="!isFormValid">Save</button>
          <button type="cancel" @click.prevent="onCancel">Cancel</button>
        </div> -->
        <div>
          <p class="order-entry" v-for="(val, k) in orderFieldDisplayOrder" :label=k :key="k" :id="val.name + 'Label'">
            <label :for="val.name">{{ val.display }}</label>
            <span v-if="val.name!='order_num'" :id="val.name" >{{ selectedIncomingOrder[val.name] }}</span>
            <a v-if="val.name=='order_num' && selectedIncomingOrder['source_name']=='Shopify'" :href="`https://admin.shopify.com/store/2600-magazine/orders/${selectedIncomingOrder['web_ref']}`" target="_blank" title="Open order in new tab">
              {{ selectedIncomingOrder[val.name] }}
            </a>
            
            <br>
            <!-- <span v-for="(error, index) of v$.$errors" :key="index">
              <p v-if="k==error.$property" class="err">{{ error.$message }}</p>
            </span> -->
          </p>
          <br><br>
          <p class="order-entry-lines"><label>Order Lines</label><br></p>
          <p class="order-entry-lines" v-for="(val, k) in selectedIncomingOrder.order_lines" :label=k :key="k" >
            <label>{{ val.quantity }} ea. - </label>
            <span :id="val.id" >{{ val.item }}</span>
            <br>
          </p>
          <div v-if="selectedIncomingOrder.shippingAddress" >
            <br>
            <p class="order-entry-ship" >
              <label> Ship Addr:</label>
              <span>{{ selectedIncomingOrder.shippingAddress.address1 }}</span>
              <br>
              <label v-if="selectedIncomingOrder.shippingAddress.address2 != '' && selectedIncomingOrder.shippingAddress.address2 != null">&nbsp;</label><span v-if="selectedIncomingOrder.shippingAddress.address2 != '' && selectedIncomingOrder.shippingAddress.address2 != null">{{ selectedIncomingOrder.shippingAddress.address2 }}</span>
              <br v-if="selectedIncomingOrder.shippingAddress.address2 != '' && selectedIncomingOrder.shippingAddress.address2 != null">
              <label>&nbsp;</label><span >{{ selectedIncomingOrder.shippingAddress.city }}, {{ selectedIncomingOrder.shippingAddress.state }} {{ selectedIncomingOrder.shippingAddress.zip }}</span>
              <br v-if="selectedIncomingOrder.shippingAddress.country != 'United States'">
              <label v-if="selectedIncomingOrder.shippingAddress.country != 'United States'">&nbsp;</label><span v-if="selectedIncomingOrder.shippingAddress.country != 'United States'">{{ selectedIncomingOrder.shippingAddress.country }}</span>
            </p>
            
          </div>
          <p class="order-entry-bill" >
            <br><br>
            <label> Bill Addr:</label>
            <span>{{ selectedIncomingOrder.billingAddress.address1 }}</span>
            <br>
            <label v-if="selectedIncomingOrder.billingAddress.address2 != '' && selectedIncomingOrder.billingAddress.address2 != null">&nbsp;</label><span v-if="selectedIncomingOrder.billingAddress.address2 != '' && selectedIncomingOrder.billingAddress.address2 != null">{{ selectedIncomingOrder.billingAddress.address2 }}</span>
            <br v-if="selectedIncomingOrder.billingAddress.address2 != '' && selectedIncomingOrder.billingAddress.address2 != null">
            <label>&nbsp;</label><span >{{ selectedIncomingOrder.billingAddress.city }}, {{ selectedIncomingOrder.billingAddress.state }} {{ selectedIncomingOrder.billingAddress.zip }}</span>
            <br v-if="selectedIncomingOrder.billingAddress.country != 'United States'">
            <label v-if="selectedIncomingOrder.billingAddress.country != 'United States'">&nbsp;</label><span v-if="selectedIncomingOrder.billingAddress.country != 'United States'">{{ selectedIncomingOrder.billingAddress.country }}</span>
          </p>
        </div>
        <!-- <div style="display: inline-block;">
          <button type="submit" :disabled="!isFormValid">Save</button>
          <button type="cancel" @click.prevent="onCancel">Cancel</button>
        </div> -->
      </form>
    </div>
    <div v-if="!selectedIncomingOrder"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import DataService from "../services/data-service.js";
// import useValidate from '@vuelidate/core'
// import { required, email, minLength, sameAs } from '@vuelidate/validators'
// import { useCustomerStore } from '../stores/customer'
// const custStore = useCustomerStore();
// const emit = defineEmits(['select-incoming-order']);
const props = defineProps({
  order: {
    type: Object,
    required: false
  }
});

const selectedIncomingOrder = ref(null);

const orderFieldDisplayOrder = [
	{name:"order_num",display:"Order Num:"},
	{name:"first_name",display:"First:"},
	{name:"last_name",display:"Last:"},
	{name:"email",display:"Email:"},
  {name:"customer_note",display:"Note:"},
]

// const rules = computed(() => {
//   return {
//     First: { required },
//     Last: { required },
//     Email: { required, email },
//     Subtype: { required },
//   }
// })
// const v$ = useValidate(rules, selectedIncomingOrder)

// const isFormValid = async () => {
//   const result = await v$.value.$validate();
//   return result;
// }

watch(
  () => props.order,
  async (newVal) => {
    if (newVal) {
        selectedIncomingOrder.value = { ...newVal }; // Shallow copy to avoid direct mutation
        if(selectedIncomingOrder.value.shippingAddress)
        {
          selectedIncomingOrder.value.first_name = selectedIncomingOrder.value.shippingAddress.first_name;
          selectedIncomingOrder.value.last_name = selectedIncomingOrder.value.shippingAddress.last_name;
        }
        else
        {
          selectedIncomingOrder.value.first_name = selectedIncomingOrder.value.billingAddress.first_name;
          selectedIncomingOrder.value.last_name = selectedIncomingOrder.value.billingAddress.last_name;
        }
        
    }
  }
);

// const onCancel = () => {
//     selectedIncomingOrder.value = null;
//     custStore.incoming_orders = [];
//     emit('select-incoming-order', null);
// };

// const updateCustomer = async () => {
  
//   // Add update logic here
//   const result = await v$.value.$validate()

//   if (!result) {
//     alert(`Form failed validation\n\n${v$.value.$errors[0].$propertyPath} ${v$.value.$errors[0].$message}`);
//   } else {
//     DataService.updateCustomer(selectedCustomer.value.id, selectedCustomer)
//     .then(response => {
//       console.log(response.data);
//       alert(`Customer ${selectedCustomer.value.name} updated!`);
//       selectedCustomer.value = null;
//     })
//     .catch(e => {
//       console.log(e);
//       alert(`Error updating customer ${selectedCustomer.value.name}`);
//     });
//   }
// };
</script>

<style scoped>
  .incoming-order-display h2 {
    line-height: .5;
  }
  .incoming-order-display {
    /* width: 200px; */
    /* padding-bottom: 10px; */
    flex: 1.5;
    font-weight: bold;
  }

  .incoming-order-display form {
    display: flex;
    flex-direction: column;
  }

  .order-entry {
    margin: 5px 0 5px 0;
    line-height: 1.1;
    /* display: flex; */
    /* flex-direction: row; */
  }
  .order-entry label {
    /* display: inline-block; */
    text-transform: capitalize;
    float: left;
    text-align: right;
    width:6em;
  }

  .order-entry span,a {
    /* display: inline-block; */
    float: left;
    margin-left: 1em;
    width: calc(100% - 7em);
    font-weight: bold;
    text-align: left;
  }

  .order-entry-lines {
    margin: 5px 0 5px 0;
    line-height: 1.1;
    /* display: flex; */
    /* flex-direction: row; */
  }

  .order-entry-lines label {
    /* display: inline-block; */
    text-transform: capitalize;
    float: left;
    text-align: right;
    width:6em;
  }

  .order-entry-lines span {
    /* display: inline-block; */
    float: left;
    margin-left: 1em;
    width: calc(100% - 7.2em);
    font-weight: bold;
    text-align: left;
  }

  .order-entry-ship {
    margin: 5px 0 5px 0;
    line-height: 1.1;
    /* display: flex; */
    /* flex-direction: row; */
  }
  .order-entry-ship label {
    /* display: inline-block; */
    text-transform: capitalize;
    float: left;
    text-align: right;
    width:6em;
  }

  .order-entry-ship span {
    /* display: inline-block; */
    float: left;
    margin-left: 1em;
    /* width: calc(100% - 12em); */
    font-weight: bold;
  }

  .order-entry-bill {
    margin: 5px 0 5px 0;
    line-height: 1.1;
    /* display: flex; */
    /* flex-direction: row; */
  }
  .order-entry-bill label {
    /* display: inline-block; */
    text-transform: capitalize;
    float: left;
    text-align: right;
    width:6em;
  }

  .order-entry-bill span {
    /* display: inline-block; */
    float: left;
    margin-left: 1em;
    /* width: calc(100% - 12em); */
    font-weight: bold;
  }
</style>