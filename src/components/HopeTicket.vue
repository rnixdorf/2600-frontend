<template>
  <div class="hope-form" v-if="selectedHope">
    <h3>Edit Hope</h3>
    <form @submit.prevent="updateHopeTicket">
      <div>
        <p class="hope-entry" v-for="(val, k) in selectedHope" :label=k :key="k">
          <label for=k>{{ k }}:</label>
          <input v-if="inputType[k]=='checkbox'" type="checkbox" id=k v-model="selectedHope[k]" />
          <input v-else-if="inputType[k]=='readonly'" id=k v-model="selectedHope[k]" readonly/>
          <span v-else-if="inputType[k]=='string'" id=k >{{ selectedHope[k] }}</span>
          <input v-else id=k v-model="selectedHope[k]" />
          <br>
          <span v-for="(error, index) of v$.$errors" :key="index">
            <p v-if="k==error.$property" class="err">{{ error.$message }}</p>
          </span>
        </p>
      </div>
      <button type="submit" :disabled="!isFormValid">Save</button>
    </form>
  </div>
  <div class="hope-form" v-if="!selectedHope"></div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DataService from "../services/data-service.js";
import useValidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'


const props = defineProps({
    ticket: {
        type: Object,
        required: false
    }
})

const selectedHope = ref(null);

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

watch(
  () => props.ticket,
  (newVal) => {
    if (newVal) {
      selectedHope.value = { ...newVal }; // Shallow copy to avoid direct mutation
    }
  }
);

const isFormValid = async () => {
  const result = await v$.value.$validate();
  return result;
}

const rules = computed(() => {
  return {
    first_name: { required },
    last_name: { required },
    email: { required, email },
  }
})
// const v$ = useValidate(rules, hopeTicket)

const updateHopeTicket = async () => {
  const result = await v$.value.$validate()

  if (!result) {
    console.log("Form failed validation", v$.value.$errors)
  } else {
    DataService.updateHope(hopeTicket.id, hopeTicket)
    .then(response => {
      console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
  }
}




</script>

<style scoped>
.hope-form {
  width: 200px;
  padding: 10px;
  flex: 1.5;
}
.hope-form form {
  display: flex;
  flex-direction: column;
}
.hope-form form div {
  margin-bottom: 10px;
}
.hope-entry label {
  /* display: inline-block; */
  float: left;
  text-align: right;
  width: 7em;
}
.hope-entry input {
  /* display: inline-block; */
  float: left;
  margin-left: 1em;
  width: 25em;
}
.hope-entry {
  margin: 5px 0 5px 0;
  /* display: flex; */
  /* flex-direction: row; */
}
.hope-entry input[type="checkbox"] {
  width: 1em;
  margin-top: 6px;
}
.hope-entry input[type="radio"] {
  width: 1em;
  margin-left: 1px;
  margin-top: 6px;
}
.hope-entry label[class="radio-label"] {
  /* display: inline-block; */
  text-align: left;
  width: 3em;
  margin-right: 2em;
  /* float: left; */
}
.radio-span {
  float: left;
  margin-left: 1em;
}
.hope-entry span[type="radio"] input {
  float: left;
  width: 1em;
  margin-left: 1em;
}
.hope-entry span {
  float: left;
  margin-left: 1em;
}
</style>
