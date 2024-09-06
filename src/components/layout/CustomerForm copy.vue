<template>
  <h3>Edit Customer</h3>
  <el-form :model="customer" ref="form" @submit.prevent="updateCustomer">
    <el-form-item label-width="50px" v-for="(val, k) in customer" :label=k :key="k">
      <el-input v-model="customer[k]" />
      <span v-for="(error, index) of v$.$errors" :key="index">
        <p v-if="k==error.$property" class="err">{{ error.$message }}</p>
      </span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" :disabled="!isFormValid">Update Customer</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { onMounted, onBeforeUnmount, onUpdated, ref } from 'vue';
import { useRoute } from 'vue-router';
import DataService from "../services/data-service.js";
import useValidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { reactive, computed } from 'vue'

const route = useRoute();
// const inId = ref(route.params.id) // Access the id param from the route
let customer = reactive({})
    //   id: null,
    //   First: "",
    //   Last: "",
    //   email: ""
    // })
const rules = computed(() => {
  return {
    First: { required },
    Last: { required },
    Email: { required, email },
  }
})
const v$ = useValidate(rules, customer)

const getCustomer = async (id) => {
  let response  = await DataService.getCustomerById(id);

  Object.assign(customer, response.data[0]);
}

const updateCustomer = async () => {
  const result = await v$.value.$validate()

  if (!result) {
    console.log("Form failed validation", v$.value.$errors)
  } else {
    DataService.updateCustomer(customer.id, customer)
    .then(response => {
      console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
  }
}



const isFormValid = async () => {
  const result = await v$.value.$validate();
  return result;
}

onMounted(async () => {
  await getCustomer(route.params.id);
  console.log("mounted customer: ",customer);
})

onBeforeUnmount(() => {
  console.log("before unmount");
})

onUpdated(() => {
  console.log("updated");
})


</script>

<style scoped>
.el-form {
  padding-left: 1em;
}

.el-form-item {
  margin-bottom: 5px;
}


.err {
  color: red;
  line-height: 0px;
}
</style>
