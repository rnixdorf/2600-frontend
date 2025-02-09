<template>
	<div class="dailySheet-items">
		<div v-if="selectedDailySheet">
			<h2>Daily Sheet {{ dailySheet.name }}
			<br><br>
			{{ new Date(dailySheet.create_date).toLocaleString() }}</h2>
			<div v-for="item in selectedDailySheet" :key="item.enter_date" 
					class="dailySheet-item" @dblclick="handleDoubleClick(item)">
				<div >Rec Num: {{ item.customer_id }}&emsp;Customer: {{ item.customer_name }}</div>
				<span>
					<button v-if="item.orders[0].order_lines && item.orders[0].order_lines.length" @click="toggleCollapse(item.bho_id)" class="small-button" >
						<Icon :icon="iconPlus" />
					</button>
					{{ (new Date(item.enter_date)).toLocaleDateString() }} {{ item.memo }}
				</span>
				<!-- <div v-if="item.orders[0].order_lines && item.orders[0].order_lines.length">		 -->
					<div v-if="collapsedItems[item.bho_id]">
						<div v-for="order in item.orders" :key="order.id" class="order-item">
							<div v-if="dailySheet.id == order.fk_batches_id && order.order_lines && order.order_lines.length">
								<div v-for="order in order.order_lines" :key="order.id">
									<div>Qty: {{ order.quantity }}&emsp;Item: {{ order.item }}</div>
								</div>
							</div>
						</div>
					</div>
				<!-- </div> -->
			</div>
		</div>
		<div v-if="!selectedDailySheet">
			No Daily Sheet Selected
		</div>
	</div>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue';
import { useCustomerStore } from '../stores/customer'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue';

const iconPlus = ref('mdi:plus');

const { loading, error, daily_sheets } = storeToRefs(useCustomerStore());
const custStore = useCustomerStore();


const selectedDailySheet = ref(null);
const props = defineProps({
	dailySheet: {
		type: Object,
		required: false
	}
});
// const emit = defineEmits(['select-dailySheet']);
const emit = defineEmits(['select-dailySheet','rebuild-dailySheet-list']);

const collapsedItems = ref({});

const toggleCollapse = (itemId) => {
	collapsedItems.value[itemId] = !collapsedItems.value[itemId];
};

const handleDoubleClick = (item) => {
	console.log('Div was double-clicked');
	console.log('Item:', item);
	// Add your double-click logic here
};

onMounted(() => {
    
});

watch(() => props.dailySheet, 
	async (newVal) => {
    if (newVal) {
        let items = await custStore.getDailySheetItems(newVal.id);
		console.log('items result:', items);
		console.log('Daily Sheet Items:', custStore.daily_sheet_items);
		selectedDailySheet.value = { ...custStore.daily_sheet_items };
		console.log('Selected Daily Sheet:', selectedDailySheet.value);
	} else {
		selectedDailySheet.value = null;
    }
});

</script>

<style scoped>
.dailySheet-items h2 {
	line-height: .5;
}
.dailySheet-items {
	/* width: 200px; */
	/* padding-bottom: 10px; */
	flex: 1.5;
	font-weight: bold;
}
.dailySheet-item {
	padding: 5px;
	border-bottom: 1px solid #ccc;
	text-align: left;
	margin-left: 10%;
}
.order-item {
	padding: 5px;
	border-bottom: 1px solid #eee;
	margin-left: 5%;
}

.small-button {
	padding: 1px;
	background-color: lightblue;
	border: none;
	border-radius: 20%;
	color: white;
	margin-right:.4em;
	/* margin-bottom: .5em; */
}
.small-button:hover {
	background-color: darkblue;
}

</style>