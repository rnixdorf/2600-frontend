<template>
    <div class="incoming-order-matching">
		<div v-if="selectedIncomingOrder">
			<h2>Match List</h2>
			<!-- {{ selectedIncomingOrder.prev_orders }} -->
			<!-- <br> -->
			<!-- {{ params }} -->
			<div class="searchInputs">
				<label class="searchLabel">First Name</label>
				<input
					name="firstSearch"
					class="search-field textfield-closed"
					type="search"
					placeholder="Search first name" 
					v-model="firstFilter"
				/>
				<br>
				<label class="searchLabel">Last Name</label>
				<input
					name="lastSearch"
					class="search-field textfield-closed"
					type="search"
					placeholder="Search last name" 
					v-model="lastFilter"
				/>
				<br>
				<label class="searchLabel">Address 1</label>
				<input
					name="addr1Search"
					class="search-field textfield-closed"
					type="search"
					placeholder="Search address 1" 
					v-model="addr1Filter"
				/>
				<br>
				<label class="searchLabel">Zipcode</label>
				<input
					name="zipcodeSearch"
					class="search-field textfield-closed"
					type="search"
					placeholder="Search Zipcode" 
					v-model="zipFilter"
				/>
				<br>
				<label class="searchLabel">Country</label>
				<input
					name="countrySearch"
					class="search-field textfield-closed"
					type="search"
					placeholder="Search Country" 
					v-model="countryFilter"
				/>
				<button @click="lastFilter = '';zipFilter='';firstFilter=''">Clear Search</button>
				<button @click="selectCustomer()">New Customer</button>
			</div>
			<!-- <hr> -->
			<p v-if="loading">Loading matches...</p>
    		<p v-else-if="error">{{ error.message }}</p>
			<div v-else-if="(matches.orderQ && matches.orderQ.length > 0) || (matches.customers && matches.customers.length > 0)">
				<div v-if="matches.orderQ && matches.orderQ.length > 0" class="single-panel">
					<ul>
						<li v-for="pOrder in matches.orderQ" :key="matches.orderQ.id" @click="selectCustomer(pOrder)">
							<span>Previous Order Match</span><br>
							{{ pOrder.name }}<br>
							<div v-if="pOrder.company != ''">{{ pOrder.company}}</div>
							<div>{{ pOrder.address1 }}</div>
							<div v-if="pOrder.address2 != ''">{{ pOrder.address2}}</div>
							<div v-if="pOrder.address3 != ''">{{ pOrder.address3}}</div>
							<div>{{ pOrder.csz }}</div>
							<div v-if="pOrder.country != '' && pOrder.country != 'USA'">{{ pOrder.country }}</div>
							<div v-if="pOrder.email != ''">{{ pOrder.email }}</div>
						</li>
					</ul>
					<hr>
				</div>
				<div v-if="matches.customers" :class="customerPanelClass">
					<ul>
						<li v-for="customer in matches.customers" :key="matches.customers.id" @click="selectCustomer(customer)">
							{{ customer.name }}<br>
							
							<div v-if="customer.company != ''">{{ customer.company}}</div>
							<div>{{ customer.address1 }}</div>
							<div v-if="customer.address2 != ''">{{ customer.address2}}</div>
							<div v-if="customer.address3 != ''">{{ customer.address3}}</div>
							<div>{{ customer.csz }}</div>
							<div v-if="customer.country != '' && customer.country != 'USA'">{{ customer.country }}</div>
							<div v-if="customer.email != ''">{{ customer.email }}</div>	
							<hr>			
						</li>
					</ul>
				</div>
			</div>
			<div v-else>
				<p>No matches found</p>
			</div>
		</div>
    </div>
	<CompareDialog
		:selectedCustomer="selectedCustomer"
		:selectedIncomingOrder="selectedIncomingOrder"
		:modelValue="showCompareDialog"
		@close="handleClose"
	/>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
// import DataService from "../services/data-service.js";
// import { storeToRefs } from 'pinia'
import { useCustomerStore } from '../stores/customer'
const custStore = useCustomerStore();
import CompareDialog from './CompareDialog.vue';
// const { loading, error } = storeToRefs(useCustomerStore());
const showCompareDialog = ref(false);
const selectedCustomer = ref({});
const selectedIncomingOrder = ref({});
const matches = ref({});
const props = defineProps({
	order: {
		type: Object,
		required: false
	}
});
const loading = ref(false);
const error = ref(null);
const params = ref({name: '', zip: '', country: '',prev_order: '',first_name: '',last_name: '',address1: ''});

watch(
	() => props.order,
	async (newVal) => {
		if (newVal) {
			selectedIncomingOrder.value = { ...newVal }; // Shallow copy to avoid direct mutation
			if(selectedIncomingOrder.value.shippingAddress)
			{
				selectedIncomingOrder.value.first_name = selectedIncomingOrder.value.shippingAddress.first_name;
				selectedIncomingOrder.value.last_name = selectedIncomingOrder.value.shippingAddress.last_name;
				params.value.zip = selectedIncomingOrder.value.shippingAddress.zip;
				params.value.country = selectedIncomingOrder.value.shippingAddress.country;
				params.value.first_name = selectedIncomingOrder.value.shippingAddress.first_name;
				params.value.last_name = selectedIncomingOrder.value.shippingAddress.last_name;
				params.value.address1 = selectedIncomingOrder.value.shippingAddress.address1;
			}
			else
			{
				selectedIncomingOrder.value.first_name = selectedIncomingOrder.value.billingAddress.first_name;
				selectedIncomingOrder.value.last_name = selectedIncomingOrder.value.billingAddress.last_name;
				params.value.zip = selectedIncomingOrder.value.billingAddress.zip;
				params.value.country = selectedIncomingOrder.value.billingAddress.country;
				params.value.first_name = selectedIncomingOrder.value.billingAddress.first_name;
				params.value.last_name = selectedIncomingOrder.value.billingAddress.last_name;
				params.value.address1 = selectedIncomingOrder.value.billingAddress.address1;
			}
			if( selectedIncomingOrder.value.prev_orders )
			{
				selectedIncomingOrder.value.prev_orders = selectedIncomingOrder.value.prev_orders.map( order => {
					if( order.node.name != selectedIncomingOrder.value.order_num )
					{
						return {
							order_num: order.node.name
						}
					}
				});
				selectedIncomingOrder.value.prev_orders = selectedIncomingOrder.value.prev_orders.filter( order => order != undefined );
				if( selectedIncomingOrder.value.prev_orders.length > 0 )
				{
					params.value.prev_order = selectedIncomingOrder.value.prev_orders[0].order_num;
				}
				else
				{
					params.value.prev_order = '';
				}
			}
			else
			{
				params.value.prev_order = '';
			}
			loading.value = true;
			let check = await custStore.getMatchingCustomers(params.value);
			// console.log(check);
			matches.value = check;
			loading.value = false;

		}
	}
);

const countryFilter = computed({
	get() {
		return params.value.country;
	},
	async set(val) {
		params.value.country = val;
		loading.value = true;
		matches.value = await custStore.getMatchingCustomers(params.value);
		loading.value = false;
	}
});

const addr1Filter = computed({
	get() {
		return params.value.address1;
	},
	async set(val) {
		params.value.address1 = val;
		loading.value = true;
		matches.value = await custStore.getMatchingCustomers(params.value);
		loading.value = false;
	}
});

const lastFilter = computed({
    get() {
    	return params.value.last_name;
    },
    async set(val) {
		params.value.last_name = val;
		loading.value = true;
		matches.value = await custStore.getMatchingCustomers(params.value);
		loading.value = false;
    }
});

const customerPanelClass = computed(() => {
	if( matches.value.orderQ && matches.value.orderQ.length == 0 )
	{
		return 'scrollable-panel';
	}
	else
	{
		return 'scrollable-short';
	}
	// return matches.value.orderQ.length > 0 ? 'scrollable-short' : 'scrollable-panel';

});
const firstFilter = computed({
	get() {
		return params.value.first_name;
	},
	async set(val) {
		params.value.first_name = val;
		loading.value = true;
		matches.value = await custStore.getMatchingCustomers(params.value);
		loading.value = false;
	}
});
const zipFilter = computed({
    get() {
    	return params.value.zip;
    },
    async set(val) {
    	params.value.zip = val;
		loading.value = true;
		matches.value = await custStore.getMatchingCustomers(params.value);
		loading.value = false;
    }
});

const selectCustomer = (customer) => {
	if( !customer)
	{
		customer = {};
	}
	selectedCustomer.value = customer;
	openCompareDialog();
}

const openCompareDialog = () => {
	showCompareDialog.value = true;
}

const handleClose = (data) => {
	showCompareDialog.value = false;
};
</script>

<style scoped>
	.single-panel {
		flex-grow: 1; /* Take up remaining space */
		overflow-y: auto;
		/* height: calc(100vh - 310px); */
		background-color: lightblue;
	}
	.single-panel span {
		color: red;
	}
    .scrollable-panel {
		flex-grow: 1; /* Take up remaining space */
		overflow-y: auto;
		height: calc(100vh - 349px);
	}
	.scrollable-short {
		flex-grow: 1; /* Take up remaining space */
		overflow-y: auto;
		height: calc(100vh - 467px);
	}
	.incoming-order-matching h2 {
		line-height: .2;
	}
	.incoming-order-matching {
		/* width: 200px; */
		background: #f5f5f5;
		/* padding-left: 5px; */
		flex: 1.1;
		/* text-align: left; */
		font-weight: bold;
	}
	.incoming-order-matching ul {
		list-style-type: none;
		padding: 0;
		line-height: 1;
		margin: 0;
	}
	.incoming-order-matching li {
		cursor: pointer;
		font-size: .9em;
		/* padding: 2px; */
	}
	.incoming-order-matching li:hover {
		background: #ddd;
	}
	.incoming-order-matching button {
		background-color: lightgray;
		margin-top: 10px;
		margin-left: 20px;
		width: 120px;
		align-self: center;
		height: 25px;
		padding: 0;
		color: black;
	}
	.searchLabel {
		display: inline-block;
		/* font-size: 1.2em; */
		font-weight: bold;
		width: 6em;
		margin-left: 10px;
	}

	.searchInputs {
		text-align: left;
		margin-bottom: 10px;
		margin-left: 10px;
		margin-right: 10px;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f5f5f5;
		/* display: flex; */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.search-field {
		width: calc(100% - 9em);
	}
</style>