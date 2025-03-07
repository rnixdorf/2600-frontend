<!-- CompareDialog.vue -->
<template>
	<v-dialog v-model="dialog" max-width="600px">
		<v-card>
			<v-card-title>
				<span class="headline">Compare Customer and Incoming Order</span>
			</v-card-title>
			<v-card-actions>
				<v-spacer></v-spacer>
				<button color="blue darken-1" text @click="closeDialog">Close</button>
			</v-card-actions>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols="6">
							<h3>Customer</h3>
							<p v-for="(value, key) in selectedCustomer" :key="key">
								{{ key }}: {{ value }}
							</p>
						</v-col>
						<v-col cols="6">
							<h3>Incoming Order</h3>
							<p v-for="(value, key) in selectedIncomingOrder" :key="key">
								{{ key }}: {{ value }}
							</p>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<h3>Comparison</h3>
							<p v-for="(comparison, key) in comparisons" :key="key">
								{{ key }}: {{ comparison }}
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
const emit = defineEmits(['update:modelValue', 'close']);
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

watch(dialog, (newVal) => {
	emit('update:modelValue', newVal);
});

watch(() => props.modelValue, (newVal) => {
	dialog.value = newVal;
});

const comparisons = computed(() => {
	const result = {};
	let check = props.selectedIncomingOrder.shippingAddress != null ? props.selectedIncomingOrder.shippingAddress : props.selectedIncomingOrder.billingAddress;
	// console.log(props.selectedCustomer);
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
			if( check[value.name] == '' )
			{
				check[value.name] = ' ';
			}
			if( props.selectedCustomer[value.name] == '' )
			{
				props.selectedCustomer[value.name] = ' ';
			}
			const checkPhone = parsePhoneNumberWithError(check[value.name], check["countryCodeV2"]);
			const customerPhone = parsePhoneNumberWithError(props.selectedCustomer[value.name], check["countryCodeV2"]);
			if( checkPhone && customerPhone )
			{
				if( checkPhone.isValid() && customerPhone.isValid() )
				{
					if( checkPhone.number == customerPhone.number )
					{
						result[value.display] = 'Match';
					}
					else
					{
						result[value.display] = 'Mismatch';
					}
				}
				else
				{
					result[value.display] = 'Mismatch';
				}
			}
			else
			{
				result[value.display] = 'Mismatch';
			}
			continue;
		}
		if (props.selectedCustomer[value.name].toUpperCase() === check[value.name].toUpperCase()) {
			result[value.display] = 'Match';
		} else {
			console.log('Mismatch',check[value.name], props.selectedCustomer[value.name]);
			console.log(check);
			console.log(props.selectedCustomer);
			result[value.display] = 'Mismatch';
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
.headline {
	font-weight: bold;
}
</style>