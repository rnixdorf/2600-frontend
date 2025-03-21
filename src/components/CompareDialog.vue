<!-- CompareDialog.vue -->
<template>
	<v-dialog v-model="dialog" class="compare-dialog-form" persistent>
		<v-card>
			<v-card-title>
				<floating right>
					<button  @click="closeDialog" type="submit" class="small-button-red" title="Cancel">
            			<Icon :icon="iconCancel" />
          			</button>
				</floating>
				<center>
					<span v-if="Object.keys(selectedCustomer).length > 0" class="headline">Compare Customer and Incoming Order</span>
					<span v-else class="headline">New Customer Order</span>
				</center>
			</v-card-title>
			<v-card-text v-if="Object.keys(comparisons).length > 0">
				<v-container>
					<v-row>
						<v-col cols="12">
							<div class="comparison-container">
								<div class="comparison-left">
									<h3>Customer</h3>
									<p v-for="(value, key) in compareFieldDisplayOrder" :key="key">
										<Label :for="value.name">{{ value.display }}</Label>
										<input data-1p-ignore v-model="selectedCustomer[value.name]" :maxlength="20" @input="handleInputChange(val.name, $event.target.value)" />
									</p>
								</div>
								<div class="comparison-right">
									<h3>Incoming Order</h3>
									<p v-for="(value, key) in comparisons" :key="key">
										<Label v-if="value.order != ''">{{ value.order }}</Label>
										<Label v-else>&nbsp;</Label>
									</p>
								</div>
							</div>
							<div class="order-lines-container">
								<h3>Order Lines</h3>
								<ul>
								<li v-for="(line, index) in selectedIncomingOrder.order_lines" :key="index">
									{{ line.quantity }} x {{ line.item }}
								</li>
								</ul>
							</div>
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
import { Icon } from '@iconify/vue';

const iconCancel = ref('mdi:close');
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
	{name:"phone",display:"Phone:"},
	{name:"email",display:"Email:"},
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
		if( value.name == 'country' && check[value.name] == 'United States' )
		{
			check[value.name] = 'USA'; // normalize country name for comparison
		}
		if( value.name == 'phone' )
		{
			console.log("phone", check[value.name], props.selectedCustomer[value.name]);

			try {
				const checkPhone = parsePhoneNumberWithError(check[value.name], check["countryCodeV2"]);
				const customerPhone = parsePhoneNumberWithError(props.selectedCustomer[value.name], check["countryCodeV2"]);
				if( checkPhone && customerPhone )
				{
					if( checkPhone.isValid() && customerPhone.isValid() )
					{
						if( checkPhone.number == customerPhone.number )
						{
							result[value.display] = {
								"customer":props.selectedCustomer[value.name],
								"order":"",
								"value":props.selectedCustomer[value.name],
								"name":value.name
							};
						}
						else
						{
							result[value.display] = {
								"customer":props.selectedCustomer[value.name],
								"order":check[value.name],
								"value":props.selectedCustomer[value.name],
								"name":value.name
							};
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
				}
			} catch (e) {
				console.log("error", e);
				result[value.display] = {
					"customer":props.selectedCustomer[value.name],
					"order":check[value.name],
					"value":props.selectedCustomer[value.name],
					"name":value.name
				};
			}
			continue;
		}
		if (props.selectedCustomer[value.name].toUpperCase() != check[value.name].toUpperCase()) {
			result[value.display] = {
				"customer":props.selectedCustomer[value.name],
				"order":check[value.name],
				"value":props.selectedCustomer[value.name],
				"name":value.name
			};
		}
		else
		{
			result[value.display] = {
				"customer":props.selectedCustomer[value.name],
				"order":"",
				"value":props.selectedCustomer[value.name],
				"name":value.name
			};
		}
		if( result[value.display] && props.selectedCustomer[value.name] == '' )
		{
			result[value.display]["value"] = check[value.name];
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
	.v-card-text {
		padding-top: 0 !important;
	}
	.compare-dialog-form .small-button-red {
		padding: 1px;
		background-color: red;
		border: none;
		border-radius: 20%;
		color: white;
		margin-right:.4em;
		width: 25px;
		float: right;
		margin-top: .1em;
	}
	.small-button-red:hover {
		background-color: darkred;
	}
	.compare-dialog-form {
		flex-grow: 3;
	}
	.headline {
		font-weight: bold;
		width: 80%;
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

	.comparison-container {
		display: flex;
		/* justify-content: space-between; */
		margin-bottom: 1rem;
	}

	.comparison-left, .comparison-right {
		width: 47%;
	}
	.comparison-left h3 {
		padding-left: 1em;
		margin-top: .1em;
		margin-bottom: .5em;
	}
	.comparison-right h3 {
		padding-left: 1em;
		margin-top: .1em;
		margin-bottom: .9em;
	}
	.comparison-left {
		float: left;
		/* line-height: .5em; */
		border: 1px solid black;
	}
	
	.comparison-left label {
		/* display: inline-block; */
		text-transform: capitalize;
		float: left;
		text-align: right;
		width: 6em;
		margin-bottom: .2em;
		line-height: 1em;
	}
	.comparison-left input {
		/* display: inline-block; */
		float: left;
		margin-left: 1em;
		width: calc(100% - 12em);  /*75%;*/
		font-weight: bold;
		margin-bottom: .5em;
	}
	.comparison-right {
		/* float: right; */
		/* line-height: 1em; */
		border: 1px solid black;
		margin-left: 2em;
	}
	.comparison-right label {
		/* margin-bottom: .2em; */
		text-align: left;
		padding-left: 1em;
		font-weight: bold;
		line-height: 1.1em;
	}
	.comparison-right p {
		margin-bottom: .62em;
		margin-top: .5em;
		font-weight: bold;
		line-height: .9em;
	}
	.order-lines-container {
		margin-top: 1rem;
	}
</style>
