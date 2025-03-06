<template>
	<div class="customer-form" v-if="selectedCustomer">
		<h2>Edit Customer {{ selectedCustomer.last }}</h2>
		<form @submit.prevent="updateCustomer" class="scrollable-panel">
			<div style="display: inline-block;">
				<Button type="submit" :disabled="!isFormValid">Save</Button>
				<Button type="cancel" @click.prevent="onCancel">Cancel</Button>
			</div>
			<div>
				<div class="customer-entry" v-for="(val, k) in customerFieldDisplayOrder" :label=k :id="val.name + 'Label'" :key="k">

					<Label :for="val.name">{{ val.display }}</Label>
					<input v-if="inputType[val.name] == 'checkbox'" type="checkbox" :id="val.name" v-model="selectedCustomer[val.name]" @input="handleInputChange(val.name, $event.target.value)"/>
					<input v-else-if="inputType[val.name] == 'readonly'" :id="val.name" v-model="selectedCustomer[val.name]" readonly />
					<span v-else-if="inputType[val.name] == 'string'" :id="val.name">{{ selectedCustomer[val.name] }}</span>
					<span v-else-if="inputType[val.name] == 'datestring'" :id="val.name">{{ new Date(selectedCustomer[val.name]).toLocaleString() }}</span>
					<span v-else-if="inputType[val.name] == 'hidden'" :id="val.name"></span>
					<span class="radio-span" v-else-if="inputType[val.name] == 'subtypeRadio'" :id="val.name">
						<input type="radio" :id="val.name + 'P'" value="P" v-model="selectedCustomer.subtype" />
						<Label class="radio-label" :for="val.name + 'P'">Print</Label>
						<input type="radio" :id="val.name + 'D'" value="D" v-model="selectedCustomer.subtype" />
						<Label class="radio-label" :for="val.name + 'D'">Digital</Label>
						<input type="radio" :id="val.name + 'B'" value="B" v-model="selectedCustomer.subtype" />
						<Label class="radio-label" :for="val.name + 'B'">Both</Label>
					</span>
					<span class="radio-span" v-else-if="inputType[val.name] == 'eformatRadio'" :id="val.name">
						<input type="radio" :id="val.name + 'None'" value="" v-model="selectedCustomer.eformat" />
						<Label class="radio-label" :for="val.name + 'None'">None</Label>
						<input type="radio" :id="val.name + 'PDF'" value="PDF" v-model="selectedCustomer.eformat" />
						<Label class="radio-label" :for="val.name + 'PDF'">PDF</Label>
						<input type="radio" :id="val.name + 'EPUB'" value="EPUB" v-model="selectedCustomer.eformat" />
						<Label class="radio-label" :for="val.name + 'EPUB'">EPUB</Label>
					</span>
					<v-select 
						v-else-if="inputType[val.name] == 'agencyDropdown'" 
						placeholder="" 
						:id="val.name"
						v-model="customer.fk_agency_id"
						@update:modelValue="handleInputChange('fk_agency_id', $event)" 
						:options="distributors" 
						label="company" 
						:reduce="(option) => option.id">
					</v-select>
					<textarea v-else-if="inputType[val.name] == 'textarea'" :id="val.name" v-model="selectedCustomer[val.name]" type="textarea"  @input="handleInputChange(val.name, $event.target.value)"></textarea>
					<input v-else :id="val.name" data-1p-ignore v-model="selectedCustomer[val.name]" :maxlength="selectedSchema[val.name].size" @input="handleInputChange(val.name, $event.target.value)" />
					<br v-if="inputType[val.name] != 'hidden'">
					<br v-if="inputType[val.name] == 'agencyDropdown'">
					<br v-if="inputType[val.name] == 'textarea'">
					<div v-for="(error, index) of v$.$errors" :key="index">
						<p v-if="val.name==error.$property" type="error" >{{ error.$message }}</p>
					</div>
					
				</div>
				
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
			<h2>Memo</h2>
			<form @submit.prevent="updateCustomer">
				<textarea id="orderMemo" v-model="orderMemo" class="memo-textarea"></textarea>
				<br v-if="orderMemoError">
				<span v-if="orderMemoError" class="error">{{ orderMemoError }}</span>
				<br><br>
				<Button type="submit" :disabled="isMemoEmpty">Save</Button>
				<Button type="button" @click="dialogVisible = false">Cancel</Button>
			</form>
		</dialog>
	</div>
</template>

<script setup>
import { ref, watch, computed, reactive, onMounted } from 'vue';
import DataService from "../services/data-service.js";
import useValidate from '@vuelidate/core'
import { required, email, maxLength } from '@vuelidate/validators'
import { useCustomerStore } from '../stores/customer'
import { storeToRefs } from 'pinia'
import vSelect from 'vs-vue3-select'
import { useDistributorStore } from '../stores/distributors'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
// import MemoDialog from './MemoDialog.vue';

// const dialogData = ref({});

const { distributors } = storeToRefs(useDistributorStore());
// const distStore = useDistributorStore();
const { schema } = storeToRefs(useCustomerStore());
const custStore = useCustomerStore();
const emit = defineEmits(['select-customer','new-customer','rebuild-list']);
const props = defineProps({
	customer: {
		type: Object,
		required: false
	}
});
const selectedCustomer = ref(null);
const dialogVisible = ref(false);
// const editAddress = ref({});
const touchedFields = ref({});
let selectedSchema = reactive({});
let v$ = useValidate(null, selectedCustomer)
let originalCustomer = {};

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
	"sub_code": "string",
	"coding": "string",
	"memo": "textarea",
}

const customerFieldDisplayOrder = [
	{name:"id",display:"Record Num:"},
	{name:"first",display:"First:"},
	{name:"last",display:"Last:"},
	{name:"company",display:"Company:"},
	{name:"address1",display:"Address1:"},
	{name:"address2",display:"Address2:"},
	{name:"address3",display:"Address3:"},
	{name:"city",display:"City:"},
	{name:"state",display:"State:"},
	{name:"zip",display:"Zip:"},
	{name:"country",display:"Country:"},
	{name:"phone",display:"Phone:"},
	{name:"email",display:"Email:"},
	{name:"memo",display:"Notes:"},
	{name:"sub_code",display:"Sub Code:"},
	{name:"coding",display:"Coding:"},
	{name:"order_nums",display:"Order Nums:"},
	{name:"fk_agency_id",display:"Agency:"},
	{name:"agency_ref",display:"Agency Ref:"},
	
	{name:"sample",display:"Sample?"},
	{name:"corporate",display:"Corporate?"},
	{name:"create_date",display:"Date Created:"},
	{name:"update_date",display:"Last Updated:"},
]

let addressChangeTrigger = {
	"address1": "address1",
	"address2": "address2",
	"address3": "address3",
	"city": "city",
	"state": "state",
	"zip": "zip",
	"country": "country",
};

const orderMemo = ref('');
const orderMemoError = ref('');
const isMemoEmpty = computed(() => !orderMemo.value);

const openDialog = () => {
//   dialogData.value = { message: 'Initial data from parent' }; // Replace with actual data
  dialogVisible.value = true;
};

const closeDialog = () => {
	dialogVisible.value = false;
};

const processOrder = async (id) => {
	console.log("processOrder CustomerForm", id);
	if (id == undefined) {
		id = selectedCustomer.value.id;
	}
	let dt = new Date();
	dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
	let order_data = {
		fk_customers_id: id,
		fk_order_sources_id: 3,
		fk_order_types_id: 6,
		enter_date: dt.toISOString().slice(0, 19).replace('T', ' '),
		memo: orderMemo.value,
		fk_batches_id: custStore.current_batch.id,
	};
	// console.log("order_data", order_data);
	let success = await DataService.insertCustomerOrder(order_data);
	if (!success) {
		alert("Ups, something happened 🙂", error.message);
		console.log("Api status ->", error.message);
	}
}

watch(schema, (newVal) => {
    if (newVal) {
		selectedSchema = { ...newVal };
		v$ = useValidate(rules, selectedCustomer)
		// console.log("schema newVal3: ", selectedSchema);
    }
  }, { deep: true });

let rules = computed(() => {
	// console.log("rules main:", selectedSchema.first.size);
	let rtn = {
		// first: { required }, //, maxLength: maxLength(selectedSchema.first.size) },
		last: { required }, //, maxLength: maxLength(selectedSchema.first.size) },
		// email: { required, email },
		// zip: { required },
		country: { required },
	}
	return rtn;
})

const isFormValid = async () => {
	const result = await v$.value.$validate();
	console.log("isFormValid", result);
	return result;
}

watch(
	() => props.customer,
	async (newVal) => {
		if (newVal) {
			selectedCustomer.value = { ...newVal }; // Shallow copy to avoid direct mutation
			Object.keys(addressChangeTrigger).forEach(key => {
				addressChangeTrigger[key] = selectedCustomer.value[key];
			});
			originalCustomer = { ...newVal };
			if(selectedCustomer.value.hasOwnProperty("new_type") && selectedCustomer.value.new_type == "S") {
				console.log("newSubCustomer", selectedCustomer.value.data);
				let tsub = {};
				tsub.expiration = selectedCustomer.value.data.exp;
				tsub.format_id = selectedCustomer.value.data.format_id;
				tsub.type = selectedCustomer.value.data.tName;
				custStore.createTempSubscription(tsub);
			}
			orderMemo.value = "";
		}
	}
);

const onCancel = () => {
	selectedCustomer.value = null;
	custStore.orders = [];
	touchedFields.value = {};
	emit('select-customer', null);
};

// let btnChangeAddress = (e, id) => {
// 	e.preventDefault();
// 	console.log("Change Address", id);
// 	for (let i = 0; i < selectedCustomer.value.addresses.length; i++) {
// 		if (selectedCustomer.value.addresses[i].id == id) {
// 			editAddress.value = selectedCustomer.value.addresses[i];
// 			break;
// 		}
// 	}
//     dialogVisible.value = true;
// };

// const btnNewAddress = (e) => {
// 	e.preventDefault();
// 	console.log("New Address ",selectedCustomer.value.id);
// 	editAddress.value = {
// 		first: selectedCustomer.value.first,
// 		last: selectedCustomer.value.last,
// 		company: selectedCustomer.value.company,
// 		phone: selectedCustomer.value.phone,
// 		email: selectedCustomer.value.email,
// 		address1: "",
// 		address2: "",
// 		address3: "",
// 		city: "",
// 		state: "",
// 		zip: "",
// 		country: "",
// 	}
// 	dialogVisible.value = true;
// };

// const saveAddress = async () => {
// 	// Replace with actual API call
// 	let res = await custStore.updateCustomerAddress(selectedCustomer.value.id,editAddress.value);
// 	console.log("Save Address", res);
// 	dialogVisible.value = false;
// };

const updateCustomer = async () => {
	console.log("Update Customer");
	// Add update logic here
	console.log("original", originalCustomer);
	
	const result = await v$.value.$validate()
	console.log("updateCustomer validate", result);
	let isAddressChange = false;
	if (!result) {
		console.log(`Form failed validation\n\n${v$.value.$errors[0].$propertyPath.toLocaleUpperCase()} ${v$.value.$errors[0].$message}`);
	} else {
	// if(true) {
		// selectedCustomer.value[field] = value;
    	// touchedFields.value[field] = true;

		if( selectedCustomer.value.first === undefined ) {
			selectedCustomer.value.first = "";
			touchedFields.value.first = true;
		}
		if( selectedCustomer.value.name != (selectedCustomer.value.first).trim() + " " + selectedCustomer.value.last ) {
			selectedCustomer.value.name = (selectedCustomer.value.first).trim() + " " + selectedCustomer.value.last;
			touchedFields.value.name = true;
		}
		if( selectedCustomer.value.country != (selectedCustomer.value.country).toUpperCase() ) {
			selectedCustomer.value.country = (selectedCustomer.value.country).toUpperCase();
			touchedFields.value.country = true;
		}
		if(selectedCustomer.value.coding == "" )
		{
			console.log("need to set coding");
			let z = parseInt(selectedCustomer.value.zip.toString().substr(0,3),10);
			let zcount = await DataService.getZipCount(z);
			console.log("zcount", zcount.data);

			touchedFields.value.coding = true;
		}

		const updatedFields = Object.keys(touchedFields.value).reduce((acc, key) => {
            acc[key] = selectedCustomer.value[key];
			if( addressChangeTrigger.hasOwnProperty(key) && addressChangeTrigger[key] != selectedCustomer.value[key] && selectedCustomer.value.hasOwnProperty("id") && selectedCustomer.value.id != "undefined") {
				isAddressChange = true;
			}
            return acc;
        }, {});
		console.log("addressChangeTrigger", addressChangeTrigger);
		if( Object.keys(updatedFields).length == 0) {
			console.log("No fields updated");
			return;
		}

		if(memo.value != "") {
			updatedFields.memo = memo.value;
		}

		if( orderMemo.value == "" ) {
			openDialog();
			return;
		}
		else
			closeDialog();

		// if (!validateMemo()) return;

		console.log("Updated Fields", updatedFields);
		console.log("isAddressChange", isAddressChange);

        let res = await custStore.updateCustomer(selectedCustomer.value.id, updatedFields);
        console.log("Customer updated in store", res);

		if(isAddressChange) {
			originalCustomer.address_change = 1;
			let addrRes = await custStore.updateCustomerAddress(selectedCustomer.value.id, originalCustomer);
			console.log("Customer address stored in store", addrRes);
		}
		
		

		if(selectedCustomer.value.hasOwnProperty("new_type") && selectedCustomer.value.new_type == "S") {
			console.log("adding new sub", selectedCustomer.value.data);
			let success = await DataService.updateSubscription(0, 
				{ expiration: selectedCustomer.value.data.exp, 
					active: true, 
					cancelled: false, 
					// memo: memo.value, 
					active: true,
					email: selectedCustomer.value.email,
					fk_customers_id: res.insertId, 
					fk_subscription_types_id: selectedCustomer.value.data.tid
				}
			);
		}

		let cid = selectedCustomer.value.id;
		if(res.insertId > 0)
		{
			cid = res.insertId;
			emit('rebuild-list');
		}

		processOrder(cid);
		
		onCancel();
	}
};



const handleInputChange = (field, value) => {
	
	if(value == "on") {
		value = true;
	} else if(value == "off") {
		value = false;
	}
	// console.log("handleInputChange", field, value);
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

.my-dialog button {
	background-color: lightgray;
	margin-left: 20px;
}

.scrollable-panel {
    flex-grow: 1; /* Take up remaining space */
    overflow-y: auto;
    height: calc(100vh - 175px);
}

.customer-form h2 {
	line-height: .5;
}
.customer-form {
	/* width: 200px; */
	/* padding-bottom: 10px; */
	flex: 1.5;
	font-weight: bold;
}

.customer-form form {
	display: flex;
	flex-direction: column;
}

/* .customer-form form div {
	margin-bottom: 10px;
} */

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

.customer-form form textarea[type="textarea"] {
    width: calc(100% - 10.2em); 
    /* height: 100px; */
    resize: vertical; /* Allow vertical resizing */
	font-weight: bold;
	float: left;
	margin-left: .9em;
	font-size: 1.2em;
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
	width: calc(100% - 12em);  /*75%;*/
	font-weight: bold;
}

.v-select {
	margin: 0 0 0 12px;
	/* text-transform: capitalize; */
	float: left;
	text-align: right;
	width: calc(100% - 9.5em); 
	height: 1em;
}

.v-text-field.v-text-field--solo .v-input__control{
    min-height: 5px;
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

.customer-entry p[type="error"] {
  color: red;
  line-height: 0px;
  display: flex;
  /* float: center; */
  /* height: 1em; */
  width: 100%;
  margin-left: 10em;
}

.memo-textarea {
	width: 100%;
	height: 100px;
	resize: vertical; /* Allow vertical resizing */
	font-weight: bold;
	font-size: 1.2em;
}

.error {
	color: red;
}
</style>
