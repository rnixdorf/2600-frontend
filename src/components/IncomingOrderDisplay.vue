<template>
    <div class="incoming-order-display" v-if="selectedIncomingOrder">
      <h2>Edit Customer  {{ selectedIncomingOrder.Last }}</h2>
      <form @submit.prevent="updateCustomer">
        <!-- <div style="display: inline-block;">
          <button type="submit" :disabled="!isFormValid">Save</button>
          <button type="cancel" @click.prevent="onCancel">Cancel</button>
        </div> -->
        <div>
          <p class="customer-entry" v-for="(val, k) in selectedIncomingOrder" :label=k :key="k">
            <label for=k>{{ k }}:</label>
            <input v-if="inputType[k]=='checkbox'" type="checkbox" id=k v-model="selectedIncomingOrder[k]" />
            <input v-else-if="inputType[k]=='readonly'" id=k v-model="selectedIncomingOrder[k]" readonly/>
            <span v-else-if="inputType[k]=='string'" id=k >{{ selectedIncomingOrder[k] }}</span>
            
            
            <input v-else id=k v-model="selectedIncomingOrder[k]" />
            <br>
            <span v-for="(error, index) of v$.$errors" :key="index">
              <p v-if="k==error.$property" class="err">{{ error.$message }}</p>
            </span>
          </p>
        </div>
        <div style="display: inline-block;">
          <button type="submit" :disabled="!isFormValid">Save</button>
          <button type="cancel" @click.prevent="onCancel">Cancel</button>
        </div>
      </form>
    </div>
    <div class="customer-form" v-if="!selectedCustomer"></div>
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

const inputType = {
  "Overseas":"checkbox",
  "Corporate":"checkbox",
  "Sample":"checkbox",
  "Envelope":"checkbox",
  "Digest":"checkbox",
  "id":"string",
  "create_date":"string",
  "update_date":"string",
  "Subtype":"subtypeRadio",
  "Eformat":"eformatRadio",
}

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
  (newVal) => {
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