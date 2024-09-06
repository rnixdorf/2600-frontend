<template>
	<div class="customer-form" v-if="selectedCustomer">
		<h2>Edit Customer {{ selectedCustomer.last }}</h2>
		<form @submit.prevent="updateCustomer" class="scrollable-panel">
			<div style="display: inline-block;">
				<button type="submit" :disabled="!isFormValid">Save</button>
				<button type="cancel" @click.prevent="onCancel">Cancel</button>
			</div>
			<div>
				<p class="customer-entry" v-for="(val, k) in customerFieldDisplayOrder" :label=k :key="k">
					<label for=val>{{ val.display }}</label>
					<div v-if="val.name == 'fk_primary_address_id'" >
						<div v-for="(address, index) in selectedCustomer.addresses" :key="index">
							<div v-if="address.id == selectedCustomer.fk_primary_address_id" class="list-item" @click="selectedCustomer.fk_primary_address_id = address.id">
								<span v-if="address.address1 != ''" id=val.name>{{ address.address1 }}</span>
								<br v-if="address.address1 != ''">
								<label for="addr2" v-if="address.address2 != ''">&nbsp;</label>
								<span v-if="address.address2 != ''" id="addr2">{{ address.address2 }}</span>
								<br v-if="address.address2 != ''">
								<label for="addr3" v-if="address.address3 != ''">&nbsp;</label>
								<span v-if="address.address3 != ''" id="addr3">{{ address.address3 }}</span>
								<br v-if="address.address3 != ''">
								<label for="csz">&nbsp;</label>
								<span id="csz">{{ address.city }}, {{ address.state }} {{ address.zip }}</span>
								<br>
								<label for="csz">&nbsp;</label>
								<span id="csz">{{ address.country }}</span>
								<br>
							</div>
						</div>
						<div style="display: inline-block;">
							<button type="btnAddress" v-on:click="btnChangeAddress($event, selectedCustomer.fk_primary_address_id)">Change Address</button>
							<button type="btnAddress" v-on:click="btnNewAddress">New Address</button>
						</div>
					</div>
					<input v-else-if="inputType[val.name] == 'checkbox'" type="checkbox" id=val.name v-model="selectedCustomer[val.name]" />
					<input v-else-if="inputType[val.name] == 'readonly'" id=val.name v-model="selectedCustomer[val.name]" readonly />
					<span v-else-if="inputType[val.name] == 'string'" id=val.name>{{ selectedCustomer[val.name] }}</span>
					<span v-else-if="inputType[val.name] == 'datestring'" id=val.name>{{ new Date(selectedCustomer[val.name]).toLocaleString() }}</span>
					<span v-else-if="inputType[val.name] == 'hidden'" id=val.name></span>
					<span class="radio-span" v-else-if="inputType[val.name] == 'subtypeRadio'" id=val.name>
						<input type="radio" id="typeP" value="P" v-model="selectedCustomer.subtype" />
						<label class="radio-label" for="typeP">Print</label>
						<input type="radio" id="typeD" value="D" v-model="selectedCustomer.subtype" />
						<label class="radio-label" for="typeD">Digital</label>
						<input type="radio" id="typeB" value="B" v-model="selectedCustomer.subtype" />
						<label class="radio-label" for="typeB">Both</label>
					</span>
					<span class="radio-span" v-else-if="inputType[val.name] == 'eformatRadio'" id=val.name>
						<input type="radio" id="typeNone" value="" v-model="selectedCustomer.eformat" />
						<label class="radio-label" for="typeNone">None</label>
						<input type="radio" id="typePDF" value="PDF" v-model="selectedCustomer.eformat" />
						<label class="radio-label" for="typePDF">PDF</label>
						<input type="radio" id="typeEPUB" value="EPUB" v-model="selectedCustomer.eformat" />
						<label class="radio-label" for="typeEPUB">EPUB</label>
					</span>
					<v-select v-else-if="inputType[val.name] == 'agencyDropdown'" placeholder=""  v-model="customer.fk_agency_id" :options="distributors" label="company" :reduce="(option) => option.id"></v-select>
					<input v-else id=val.name v-model="selectedCustomer[val.name]" />
					<br v-if="inputType[val.name] != 'hidden'">
					<br v-if="inputType[val.name] == 'agencyDropdown'">
				</p>
				<!-- <br>
				<p class="customer-entry" v-for="(val, k) in selectedCustomer" :label=k :key="k">
					<label v-if="inputType[k] == 'agencyDropdown'" for=k>Agency:</label>
					<label v-else-if="inputType[k] != 'hidden'" for=k>{{ k }}:</label>
					
					<input v-if="inputType[k] == 'checkbox'" type="checkbox" id=k v-model="selectedCustomer[k]" />
					<input v-else-if="inputType[k] == 'readonly'" id=k v-model="selectedCustomer[k]" readonly />
					<span v-else-if="inputType[k] == 'string'" id=k>{{ selectedCustomer[k] }}</span>
					<span v-else-if="inputType[k] == 'datestring'" id=k>{{ new Date(selectedCustomer[k]).toLocaleString() }}</span>
					<span v-else-if="inputType[k] == 'hidden'" id=k></span>
					<span class="radio-span" v-else-if="inputType[k] == 'subtypeRadio'" id=k>
						<input type="radio" id="typeP" value="P" v-model="selectedCustomer.subtype" />
						<label class="radio-label" for="typeP">Print</label>
						<input type="radio" id="typeD" value="D" v-model="selectedCustomer.subtype" />
						<label class="radio-label" for="typeD">Digital</label>
						<input type="radio" id="typeB" value="B" v-model="selectedCustomer.subtype" />
						<label class="radio-label" for="typeB">Both</label>
					</span>
					<span class="radio-span" v-else-if="inputType[k] == 'eformatRadio'" id=k>
						<input type="radio" id="typeNone" value="" v-model="selectedCustomer.eformat" />
						<label class="radio-label" for="typeNone">None</label>
						<input type="radio" id="typePDF" value="PDF" v-model="selectedCustomer.eformat" />
						<label class="radio-label" for="typePDF">PDF</label>
						<input type="radio" id="typeEPUB" value="EPUB" v-model="selectedCustomer.eformat" />
						<label class="radio-label" for="typeEPUB">EPUB</label>
					</span>
					<v-select v-else-if="inputType[k] == 'agencyDropdown'" placeholder=""  v-model="customer.fk_agency_id" :options="distributors" label="company" :reduce="(option) => option.id"></v-select>
					<input v-else id=k v-model="selectedCustomer[k]" />
	
					<br v-if="inputType[k] != 'hidden'">
					<br v-if="inputType[k] == 'agencyDropdown'">
					<span v-for="(error, index) of v$.$errors" :key="index">
						<p v-if="k == error.$property" class="err">{{ error.$message }}</p>
					</span>
				</p> -->
				
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
import { ref, watch, computed, toRefs } from 'vue';
import DataService from "../services/data-service.js";
import useValidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { useCustomerStore } from '../stores/customer'
import { storeToRefs } from 'pinia'
import vSelect from 'vs-vue3-select'
import { useDistributorStore } from '../stores/distributors'
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

const btnChangeAddress = (e, id) => {
	e.preventDefault();
	console.log("Change Address", id);
};

const btnNewAddress = (e) => {
	e.preventDefault();
	console.log("New Address");
};


const updateCustomer = async () => {
	console.log("Update Customer");
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
.scrollable-panel {
  max-height: 400px; /* Adjust as needed */
  overflow-y: auto;
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
