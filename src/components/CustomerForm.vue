<template>
	<div class="customer-form" v-if="selectedCustomer">
		<h2>Edit Customer {{ selectedCustomer.last }}</h2>
		<form @submit.prevent="updateCustomer" class="scrollable-panel">
			<div style="display: inline-block;">
				<Button type="submit" :disabled="!isFormValid">Save</Button>
				<Button type="cancel" @click.prevent="onCancel">Cancel</Button>
			</div>
			<div>
				<p class="customer-entry" v-for="(val, k) in customerFieldDisplayOrder" :label=k :key="k">
					<Label for=val>{{ val.display }}</Label>
					<div v-if="val.name == 'fk_primary_address_id'" >
						<div v-for="(address, index) in selectedCustomer.addresses" :key="index">
							<div v-if="address.id == selectedCustomer.fk_primary_address_id" class="list-item" @click="address.id">
								<span v-if="address.address1 != ''" id=val.name>{{ address.address1 }}</span>
								<br v-if="address.address1 != ''">
								<Label for="addr2" v-if="address.address2 != ''">&nbsp;</Label>
								<span v-if="address.address2 != ''" id="addr2">{{ address.address2 }}</span>
								<br v-if="address.address2 != ''">
								<Label for="addr3" v-if="address.address3 != ''">&nbsp;</Label>
								<span v-if="address.address3 != ''" id="addr3">{{ address.address3 }}</span>
								<br v-if="address.address3 != ''">
								<Label for="csz">&nbsp;</Label>
								<span id="csz">{{ address.city }}, {{ address.state }} {{ address.zip }}</span>
								<br>
								<Label for="csz">&nbsp;</Label>
								<span id="csz">{{ address.country }}</span>
								<br>
								<Label for="phone">Phone:</Label>
								<span id="phone">{{ address.phone }}</span>
								<br>
								<Label for="email">Email:</Label>
								<span id="email">{{ address.email }}</span>
								<br>
							</div>
						</div>
						<div style="display: inline-block;">
							<Button type="btnAddress" v-on:click="btnChangeAddress($event, selectedCustomer.fk_primary_address_id)">Change Address</Button>
							<Button type="btnAddress" v-on:click="btnNewAddress">New Address</Button>
						</div>
					</div>
					<input v-else-if="inputType[val.name] == 'checkbox'" type="checkbox" id=val.name v-model="selectedCustomer[val.name]" @input="handleInputChange(val.name, $event.target.value)"/>
					<input v-else-if="inputType[val.name] == 'readonly'" id=val.name v-model="selectedCustomer[val.name]" readonly />
					<span v-else-if="inputType[val.name] == 'string'" id=val.name>{{ selectedCustomer[val.name] }}</span>
					<span v-else-if="inputType[val.name] == 'datestring'" id=val.name>{{ new Date(selectedCustomer[val.name]).toLocaleString() }}</span>
					<span v-else-if="inputType[val.name] == 'hidden'" id=val.name></span>
					<span class="radio-span" v-else-if="inputType[val.name] == 'subtypeRadio'" id=val.name>
						<input type="radio" id="typeP" value="P" v-model="selectedCustomer.subtype" />
						<Label class="radio-label" for="typeP">Print</Label>
						<input type="radio" id="typeD" value="D" v-model="selectedCustomer.subtype" />
						<Label class="radio-label" for="typeD">Digital</Label>
						<input type="radio" id="typeB" value="B" v-model="selectedCustomer.subtype" />
						<Label class="radio-label" for="typeB">Both</Label>
					</span>
					<span class="radio-span" v-else-if="inputType[val.name] == 'eformatRadio'" id=val.name>
						<input type="radio" id="typeNone" value="" v-model="selectedCustomer.eformat" />
						<Label class="radio-label" for="typeNone">None</Label>
						<input type="radio" id="typePDF" value="PDF" v-model="selectedCustomer.eformat" />
						<Label class="radio-label" for="typePDF">PDF</Label>
						<input type="radio" id="typeEPUB" value="EPUB" v-model="selectedCustomer.eformat" />
						<Label class="radio-label" for="typeEPUB">EPUB</Label>
					</span>
					<v-select 
						v-else-if="inputType[val.name] == 'agencyDropdown'" 
						placeholder="" 
						id="agency_id" 
						v-model="customer.fk_agency_id"
						@update:modelValue="handleInputChange('fk_agency_id', $event)" 
						:options="distributors" 
						label="company" 
						:reduce="(option) => option.id">
					</v-select>
					<input v-else id=val.name v-model="selectedCustomer[val.name]" @input="handleInputChange(val.name, $event.target.value)" />
					<br v-if="inputType[val.name] != 'hidden'">
					<br v-if="inputType[val.name] == 'agencyDropdown'">
				</p>
				
			</div>
			<div style="display: inline-block;">
				<Button type="submit" :disabled="!isFormValid">Save</Button>
				<Button type="cancel" @click.prevent="onCancel">Cancel</Button>
			</div>
		</form>
		
	</div>
	<div class="customer-form" v-if="!selectedCustomer"></div>
	<div v-if="dialogVisible" class="modal-backdrop">
		<dialog class="my-dialog" open>
			<h2>Edit Address</h2>
			<form @submit.prevent="saveAddress">
				<Label >Address1: <input type="text" v-model="editAddress.address1" /></Label>
				<br>
				<Label>Address2: <input type="text" v-model="editAddress.address2" /></Label>
				<br>
				<Label>Address3: <input type="text" v-model="editAddress.address3" /></Label>
				<br>
				<Label>City: <input type="text" v-model="editAddress.city" /></Label>
				<br>
				<Label>State: <input type="text" v-model="editAddress.state" /></Label>
				<br>
				<Label>Zip: <input type="text" v-model="editAddress.zip" /></Label>
				<br>
				<Label>Country: <input type="text" v-model="editAddress.country" /></Label>
				<br>
				<Label>Phone: <input type="text" v-model="editAddress.phone" /></Label>
				<br>
				<Label>Email: <input type="text" v-model="editAddress.email" /></Label>
				<br><br>
				<Button type="submit">Save</Button>
				<Button type="button" @click="dialogVisible = false">Cancel</Button>
			</form>
		</dialog>
	</div>
</template>

<script setup>
import { ref, watch, computed, toRefs } from 'vue';
import DataService from "../services/data-service.js";
import useValidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { useCustomerStore } from '../stores/customer'
import { storeToRefs } from 'pinia'
import vSelect from 'vs-vue3-select'
import { useDistributorStore } from '../stores/distributors'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const { distributors } = storeToRefs(useDistributorStore());
// const distStore = useDistributorStore();
// const { orders } = storeToRefs(useCustomerStore());
const custStore = useCustomerStore();
const emit = defineEmits(['select-customer']);
const props = defineProps({
	customer: {
		type: Object,
		required: false
	}
});

const selectedCustomer = ref(null);
const dialogVisible = ref(false);
const editAddress = ref({});
const touchedFields = ref({});

const inputType = {
	"name": "string",
	"overseas": "checkbox",
	"corporate": "checkbox",
	"sample": "checkbox",
	"envelope": "checkbox",
	"digest": "checkbox",
	"id": "string",
	"create_date": "datestring",
	"update_date": "datestring",
	"Subtype": "subtypeRadio",
	"eformat": "eformatRadio",
	"import_json": "hidden",
	"fk_customers_id": "hidden",
	"addresses": "hidden",
	"fk_primary_address_id": "string",
	"fk_agency_id": "agencyDropdown",
}

const customerFieldDisplayOrder = [
	{name:"id",display:"Record Num:"},
	{name:"name",display:"Name:"},
	{name:"fk_primary_address_id",display:"Address:"},
	{name:"fk_agency_id",display:"Agency:"},
	{name:"agency_ref",display:"Agency Ref:"},
	{name:"order_nums",display:"Order Nums:"},
	{name:"sample",display:"Sample?"},
	// {name:"envelope",display:"Envelope?"},
	{name:"create_date",display:"Date Created:"},
	{name:"update_date",display:"Last Updated:"},
]

const rules = computed(() => {
	return {
		First: { required },
		Last: { required },
		Email: { required, email },
		Subtype: { required },
	}
})
const v$ = useValidate(rules, selectedCustomer)

const isFormValid = async () => {
	const result = await v$.value.$validate();
	return result;
}

watch(
	() => props.customer,
	(newVal) => {
		if (newVal) {
			selectedCustomer.value = { ...newVal }; // Shallow copy to avoid direct mutation
		}
	}
);

const onCancel = () => {
	selectedCustomer.value = null;
	// reset customerorders component
	custStore.orders = [];
	emit('select-customer', null);
};

let btnChangeAddress = (e, id) => {
	e.preventDefault();
	console.log("Change Address", id);
	for (let i = 0; i < selectedCustomer.value.addresses.length; i++) {
		if (selectedCustomer.value.addresses[i].id == id) {
			editAddress.value = selectedCustomer.value.addresses[i];
			break;
		}
	}
    dialogVisible.value = true;
};

const btnNewAddress = (e) => {
	e.preventDefault();
	console.log("New Address ",selectedCustomer.value.id);
	editAddress.value = {
		first: selectedCustomer.value.first,
		last: selectedCustomer.value.last,
		company: selectedCustomer.value.company,
		phone: selectedCustomer.value.phone,
		email: selectedCustomer.value.email,
		address1: "",
		address2: "",
		address3: "",
		city: "",
		state: "",
		zip: "",
		country: "",
	}
	dialogVisible.value = true;
};

const saveAddress = async () => {
	// Replace with actual API call
	let res = await custStore.updateCustomerAddress(selectedCustomer.value.id,editAddress.value);
	console.log("Save Address", res);
	dialogVisible.value = false;
};

const updateCustomer = async () => {
	console.log("Update Customer");
	// Add update logic here
	const result = await v$.value.$validate()

	// if (!result) {
	// 	alert(`Form failed validation\n\n${v$.value.$errors[0].$propertyPath} ${v$.value.$errors[0].$message}`);
	// } else {
	if(true) {
		const updatedFields = Object.keys(touchedFields.value).reduce((acc, key) => {
            acc[key] = selectedCustomer.value[key];
            return acc;
        }, {});
		console.log("Updated Fields", updatedFields);
		// DataService.updateCustomer(selectedCustomer.value.id, selectedCustomer)
		// .then(response => {
		// 	console.log(response.data);
		// 	alert(`Customer ${selectedCustomer.value.name} updated!`);
		// 	selectedCustomer.value = null;
		// })
		// .catch(e => {
		// 	console.log(e);
		// 	alert(`Error updating customer ${selectedCustomer.value.name}`);
		// });
	}
};

const handleInputChange = (field, value) => {
	
	if(value == "on") {
		value = true;
	} else if(value == "off") {
		value = false;
	}
	console.log("handleInputChange", field, value);
    selectedCustomer.value[field] = value;
    touchedFields.value[field] = true;
};
</script>

<style scoped>
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
  max-width: 500px;
  width: 100%;
}
/* .my-dialog {
  display: block;
  width: 460px;
} */

.my-dialog label {
	display: inline-block;
	text-transform: capitalize;
	/* float: left; */
	text-align: right;
	width: 29em;
	font-weight: bold;
}

.my-dialog input {
	/* display: inline-block; */
	float: right;
	margin-left: 1em;
	font-weight: bold;
	font-size: 1em;
	width: 21em;
}

.scrollable-panel {
    flex-grow: 1; /* Take up remaining space */
    overflow-y: auto;
    height: calc(100vh - 260px);
  }

.customer-form {
	width: 200px;
	padding: 10px;
	flex: 1.5;
	font-weight: bold;
}

.customer-form form {
	display: flex;
	flex-direction: column;
}

.customer-form form div {
	margin-bottom: 10px;
}

.customer-form form div button {
	margin-top: 10px;
	width: 100px;
	align-self: center;
	height: 30px;
	padding: 0;
}

.customer-form form button[type="submit"] {
	background-color: cadetblue;
}

.customer-form form button[type="cancel"] {
	background-color: red;
	margin-left: 2em;
}

.customer-form form button[type="btnAddress"] {
	background-color: gray;
	width: 8.5em;
	margin-left: 1em;
}

.customer-entry label {
	/* display: inline-block; */
	text-transform: capitalize;
	float: left;
	text-align: right;
	width: 7em;
}

.customer-entry input {
	/* display: inline-block; */
	float: left;
	margin-left: 1em;
	width: 70%;
}


.v-select {
	margin: 0 0 5px 12px;
	/* text-transform: capitalize; */
	float: left;
	text-align: right;
	width: 75%;
	height: 2em;
}


.customer-entry {
	margin: 5px 0 5px 0;
	/* display: flex; */
	/* flex-direction: row; */
}

.customer-entry input[type="checkbox"] {
	width: 1em;
	margin-top: 6px;
}

.customer-entry input[type="radio"] {
	width: 1em;
	margin-left: 1px;
	margin-top: 6px;
}

.customer-entry label[class="radio-label"] {
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

.customer-entry span[type="radio"] input {
	float: left;
	width: 1em;
	margin-left: 1em;
}

.customer-entry span {
	float: left;
	margin-left: 1em;
}

.list-item {
	cursor: pointer;
	padding: 5px;
}
</style>
