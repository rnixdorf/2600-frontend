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
				<label class="searchLabel">Zipcode</label>
				<input
					name="zipcodeSearch"
					class="search-field textfield-closed"
					type="search"
					placeholder="Search Zipcode" 
					v-model="zipFilter"
				/>
				<!-- <button @click="lastFilter = '';zipFilter='';companyFilter=''">Clear Search</button>
				<button @click="listDialogVisible = true;isDialogVisible = false;">New Customer</button> -->
			</div>
			<hr>
			<div v-if="matches.orderQ" class="single-panel">
				<ul>
					<li v-for="pOrder in matches.orderQ" :key="matches.orderQ.id" @click="selectCustomer(customer)">
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
			<div v-if="matches.customers" class="scrollable-panel">
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
    </div>
	<CompareDialog
		:selectedCustomer="selectedCustomer"
		:selectedIncomingOrder="selectedIncomingOrder"
		v-if="showCompareDialog"
		@close="handleClose"
	/>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
// import DataService from "../services/data-service.js";
import { useCustomerStore } from '../stores/customer'
const custStore = useCustomerStore();
import CompareDialog from './CompareDialog.vue';

const showCompareDialog = ref(false);
const selectedCustomer = ref(null);
const selectedIncomingOrder = ref(null);
const matches = ref({});
const props = defineProps({
	order: {
		type: Object,
		required: false
	}
});

const params = ref({name: '', zip: '', country: '',prev_order: '',first_name: '',last_name: ''});

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
			}
			else
			{
				selectedIncomingOrder.value.first_name = selectedIncomingOrder.value.billingAddress.first_name;
				selectedIncomingOrder.value.last_name = selectedIncomingOrder.value.billingAddress.last_name;
				params.value.zip = selectedIncomingOrder.value.billingAddress.zip;
				params.value.country = selectedIncomingOrder.value.billingAddress.country;
				params.value.first_name = selectedIncomingOrder.value.billingAddress.first_name;
				params.value.last_name = selectedIncomingOrder.value.billingAddress.last_name;
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
			let check = await custStore.getMatchingCustomers(params.value);
			console.log(check);
			matches.value = check;
		}
	}
);

const lastFilter = computed({
    get() {
    	return params.value.last_name;
    },
    async set(val) {
		params.value.last_name = val;
		matches.value = await custStore.getMatchingCustomers(params.value);
    }
});
const firstFilter = computed({
	get() {
		return params.value.first_name;
	},
	async set(val) {
		params.value.first_name = val;
		matches.value = await custStore.getMatchingCustomers(params.value);
	}
});
const zipFilter = computed({
    get() {
    	return params.value.zip;
    },
    async set(val) {
    	params.value.zip = val;
		matches.value = await custStore.getMatchingCustomers(params.value);
    }
});

const selectCustomer = (customer) => {
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
		height: calc(100vh - 310px);
	}
	.incoming-order-matching h2 {
		line-height: .2;
	}
	.incoming-order-matching {
		/* width: 200px; */
		background: #f5f5f5;
		/* padding-left: 5px; */
		flex: 1.2;
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
</style>