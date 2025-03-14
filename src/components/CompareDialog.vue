<!-- CompareDialog.vue -->
<template>
	<v-dialog v-model="dialog" class="compare-dialog-form" persistent>
		<v-card>
			<v-card-title>
				<center>
					<span v-if="Object.keys(selectedCustomer).length > 0" class="headline">Compare Customer and Incoming Order</span>
					<span v-else class="headline">New Customer Order</span>
				</center>
			</v-card-title>
			<br>
			<v-card-actions>
				<v-spacer></v-spacer>
				<button color="blue darken-1" text @click="closeDialog">Close</button>
			</v-card-actions>
			<v-card-text v-if="Object.keys(comparisons).length > 0">
				<v-container>
					<v-row>
						<v-col cols="24">
							<h3>Comparison</h3>
							<p v-for="(comparison, key) in comparisons" :key="key">
								{{ key }}
								<div>
									Customer
									<input type="radio" :value="comparison.customer" :id="'customer_'+comparison.name" :name="comparison.name" :checked="comparison.customer==comparison.value">
									<label :for="'customer_'+comparison.name">{{comparison.customer}}</label>
									<br>
									Order
									<input type="radio" :value="comparison.order" :id="'order_'+comparison.name" :name="comparison.name" :checked="comparison.order==comparison.value">
									<label :for="'order_'+comparison.name">{{comparison.order}}</label>
									<!-- <span v-for="comp in comparison" :key="comp.key">
										{{ comp.name }}:
										
										<input type="radio" :checked="comp.checkValue" :id="comp.checkName">
										<label :for="comp.checkName">{{ comp.value }}</label>

										&emsp;
									</span> -->
								</div>
							</p>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { parsePhoneNumberWithError, isValidPhoneNumber } from 'libphonenumber-js';

const props = defineProps({
	selectedCustomer: {
		type: Object,
		required: true
	},
	selectedIncomingOrder: {
		type: Object,
		required: true
	},
	modelValue: {
		type: Boolean,
		required: true
	}
});
const emit = defineEmits(['close']);
const dialog = ref(props.modelValue);

const compareFieldDisplayOrder = [
	{name:"first_name",display:"First:"},
	{name:"last_name",display:"Last:"},
	{name:"company",display:"Company:"},
	{name:"address1",display:"Address 1:"},
	{name:"address2",display:"Address 2:"},
	{name:"address3",display:"Address 3:"},
	{name:"city",display:"City:"},
	{name:"stateCode",display:"State:"},
	{name:"zip",display:"Zip:"},
	{name:"country",display:"Country:"},
	{name:"phone",display:"Phone:"}
]

// watch(dialog, (newVal) => {
// 	emit('update:modelValue', newVal);
// });

watch(() => props.modelValue, (newVal) => {
	dialog.value = newVal;
});

const comparisons = computed(() => {
	const result = {};
	let check = props.selectedIncomingOrder.shippingAddress != null ? props.selectedIncomingOrder.shippingAddress : props.selectedIncomingOrder.billingAddress;
	// console.log(props.selectedCustomer);
	if( props.selectedCustomer == null || props.selectedCustomer == {} || Object.keys(props.selectedCustomer).length == 0 )
	{
		return result;
	}
	for (const value of compareFieldDisplayOrder) {
		// console.log("value", value);
		if( check[value.name] == null )
		{
			check[value.name] = '';
		}
		if( props.selectedCustomer[value.name] == null )
		{
			props.selectedCustomer[value.name] = '';
		}
		if( value.name == 'phone' )
		{
			console.log("phone", check[value.name], props.selectedCustomer[value.name]);
			// if( check[value.name] == '' )
			// {
			// 	check[value.name] = ' ';
			// }
			// if( props.selectedCustomer[value.name] == '' )
			// {
			// 	props.selectedCustomer[value.name] = ' ';
			// }
			try {
				const checkPhone = parsePhoneNumberWithError(check[value.name], check["countryCodeV2"]);
				const customerPhone = parsePhoneNumberWithError(props.selectedCustomer[value.name], check["countryCodeV2"]);
				if( checkPhone && customerPhone )
				{
					if( checkPhone.isValid() && customerPhone.isValid() )
					{
						if( checkPhone.number == customerPhone.number )
						{
							// result[value.display] = 'Match';
						}
						else
						{
							result[value.display] = {
								"customer":props.selectedCustomer[value.name],
								"order":check[value.name],
								"value":props.selectedCustomer[value.name],
								"name":value.name
							};
							// result[value.display] = {};
							// result[value.display]["customer"] = {};
							// result[value.display]["customer"]["name"] = "Customer";
							// result[value.display]["customer"]["value"] = props.selectedCustomer[value.name];
							// result[value.display]["customer"]["checkName"] = "customer_" + value.name;
							// result[value.display]["customer"]["checkValue"] = 1;
							// result[value.display]["order"] = {};
							// result[value.display]["order"]["name"] = "Order";
							// result[value.display]["order"]["value"] = check[value.name];
							// result[value.display]["order"]["checkName"] = "order_" + value.name;
							// result[value.display]["order"]["checkValue"] = 0;
						}
					}
					else
					{
						result[value.display] = {
							"customer":props.selectedCustomer[value.name],
							"order":check[value.name],
							"value":props.selectedCustomer[value.name],
							"name":value.name
						};
						// result[value.display] = {};
						// result[value.display]["customer"] = {};
						// result[value.display]["customer"]["name"] = "Customer";
						// result[value.display]["customer"]["value"] = props.selectedCustomer[value.name];
						// result[value.display]["customer"]["checkName"] = "customer_" + value.name;
						// result[value.display]["customer"]["checkValue"] = 1;
						// result[value.display]["order"] = {};
						// result[value.display]["order"]["name"] = "Order";
						// result[value.display]["order"]["value"] = check[value.name];
						// result[value.display]["order"]["checkName"] = "order_" + value.name;
						// result[value.display]["order"]["checkValue"] = 0;
					}
				}
				else
				{
					result[value.display] = {
						"customer":props.selectedCustomer[value.name],
						"order":check[value.name],
						"value":props.selectedCustomer[value.name],
						"name":value.name
					};
					// result[value.display] = {};
					// result[value.display]["customer"] = {};
					// result[value.display]["customer"]["name"] = "Customer";
					// result[value.display]["customer"]["value"] = props.selectedCustomer[value.name];
					// result[value.display]["customer"]["checkName"] = "customer_" + value.name;
					// result[value.display]["customer"]["checkValue"] = 1;
					// result[value.display]["order"] = {};
					// result[value.display]["order"]["name"] = "Order";
					// result[value.display]["order"]["value"] = check[value.name];
					// result[value.display]["order"]["checkName"] = "order_" + value.name;
					// result[value.display]["order"]["checkValue"] = 0;
				}
			} catch (e) {
				console.log("error", e);
				result[value.display] = {
					"customer":props.selectedCustomer[value.name],
					"order":check[value.name],
					"value":props.selectedCustomer[value.name],
					"name":value.name
				};
				// result[value.display] = {};
				// result[value.display]["customer"] = {};
				// result[value.display]["customer"]["name"] = "Customer";
				// result[value.display]["customer"]["value"] = props.selectedCustomer[value.name];
				// result[value.display]["customer"]["checkName"] = "customer_" + value.name;
				// result[value.display]["customer"]["checkValue"] = 1;
				// result[value.display]["order"] = {};
				// result[value.display]["order"]["name"] = "Order";
				// result[value.display]["order"]["value"] = check[value.name];
				// result[value.display]["order"]["checkName"] = "order_" + value.name;
				// result[value.display]["order"]["checkValue"] = 0;

				// if( props.selectedCustomer[value.name] == '' )
				// {
				// 	result[value.display]["order"]["checkValue"] = 1;
				// 	result[value.display]["customer"]["checkValue"] = 0;
				// }
			}
			continue;
		}
		if (props.selectedCustomer[value.name].toUpperCase() != check[value.name].toUpperCase()) {
			// result[value.display] = 'Match';
		// } else {
			// console.log('Mismatch',check[value.name], props.selectedCustomer[value.name]);
			// console.log(check);
			// console.log(props.selectedCustomer);
			result[value.display] = {
				"customer":props.selectedCustomer[value.name],
				"order":check[value.name],
				"value":props.selectedCustomer[value.name],
				"name":value.name
			};

			// result[value.display]["customer"] = {};
			// result[value.display]["customer"]["name"] = "Customer";
			// result[value.display]["customer"]["value"] = props.selectedCustomer[value.name];
			// result[value.display]["customer"]["checkName"] = "customer_" + value.name;
			// result[value.display]["customer"]["checkValue"] = 1;
			// result[value.display]["order"] = {};
			// result[value.display]["order"]["name"] = "Order";
			// result[value.display]["order"]["value"] = check[value.name];
			// result[value.display]["order"]["checkName"] = "order_" + value.name;
			// result[value.display]["order"]["checkValue"] = 0;
		}
		if( result[value.display] && props.selectedCustomer[value.name] == '' )
		{
			result[value.display]["value"] = check[value.name];
			// result[value.display]["customer"]["checkValue"] = 0;
		}
	}
	return result;
});

const closeDialog = () => {
	dialog.value = false;
	emit('close');
};
</script>

<style scoped>
	.compare-dialog-form {
		flex-grow: 3;
	}
	.headline {
		font-weight: bold;
	}
	.compare-dialog-form button {
		background-color: lightgray;
		margin-top: 10px;
		margin-left: 20px;
		width: 120px;
		align-self: center;
		height: 25px;
		padding: 0;
		color: black;
	}
</style>
