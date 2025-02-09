<template>
  <div class="incoming-order-display">
    <div v-if="selectedIncomingOrder">
      <h2>View Order  {{ selectedIncomingOrder.order_json.customer.last_name }}</h2>
      <form @submit.prevent="updateCustomer">
        <!-- <div style="display: inline-block;">
          <button type="submit" :disabled="!isFormValid">Save</button>
          <button type="cancel" @click.prevent="onCancel">Cancel</button>
        </div> -->
        <div>
          <p class="order-entry" v-for="(val, k) in orderFieldDisplayOrder" :label=k :key="k" :id="val.name + 'Label'">
            <label :for="val.name">{{ val.display }}</label>
            <span :id="val.name" >{{ selectedIncomingOrder[val.name] }}</span>

            <br>
            <span v-for="(error, index) of v$.$errors" :key="index">
              <p v-if="k==error.$property" class="err">{{ error.$message }}</p>
            </span>
          </p>
          <label>Order Lines</label>
          <p class="order-entry" v-for="(val, k) in selectedIncomingOrder.order_lines" :label=k :key="k" >
            <label>{{ val.quantity }} ea. - </label>
            <span :id="val.id" >{{ val.item }}</span>
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
import { ref, watch, computed } from 'vue';
import DataService from "../services/data-service.js";
import useValidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { useCustomerStore } from '../stores/customer'
const custStore = useCustomerStore();
const emit = defineEmits(['select-incoming-order']);
const props = defineProps({
  order: {
    type: Object,
    required: false
  }
});

const selectedIncomingOrder = ref(null);

const orderFieldDisplayOrder = [
	{name:"id",display:"Order Num:"},
	{name:"first_name",display:"First:"},
	{name:"last_name",display:"Last:"},
	{name:"email",display:"Email:"},
  {name:"customer_note",display:"Note:"},
]

const rules = computed(() => {
  return {
    First: { required },
    Last: { required },
    Email: { required, email },
    Subtype: { required },
  }
})
const v$ = useValidate(rules, selectedIncomingOrder)

const isFormValid = async () => {
  const result = await v$.value.$validate();
  return result;
}

watch(
  () => props.order,
  async (newVal) => {
    if (newVal) {
        selectedIncomingOrder.value = { ...newVal }; // Shallow copy to avoid direct mutation
    }
  }
);

const onCancel = () => {
    selectedIncomingOrder.value = null;
    custStore.incoming_orders = [];
    emit('select-incoming-order', null);
};

const updateCustomer = async () => {
  
  // Add update logic here
  const result = await v$.value.$validate()

  if (!result) {
    alert(`Form failed validation\n\n${v$.value.$errors[0].$propertyPath} ${v$.value.$errors[0].$message}`);
  } else {
    DataService.updateCustomer(selectedCustomer.value.id, selectedCustomer)
    .then(response => {
      console.log(response.data);
      alert(`Customer ${selectedCustomer.value.name} updated!`);
      selectedCustomer.value = null;
    })
    .catch(e => {
      console.log(e);
      alert(`Error updating customer ${selectedCustomer.value.name}`);
    });
  }
};
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

  .order-entry span {
    /* display: inline-block; */
    float: left;
    margin-left: 1em;
    /* width: calc(100% - 12em); */
    font-weight: bold;
  }
</style>