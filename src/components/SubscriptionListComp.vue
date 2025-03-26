<template>
    <div v-if="subscriptions.length > 0" class="subListComp">
        <h3>Current Subscriptions</h3>
        <ul style="display: inline-block;">
            <!-- <button v-if="!(subscriptions.length == 1 && subscriptions[0].id == 0)" class="small-button" type="submit" @click="newSubDialog();" title="New Subscription">
            New Sub
            </button>
            <br> -->
            <li v-for="(subscription) in subscriptions" :key="subscription.id">
                <button v-if="subscription.id > 0" class="small-button" type="submit" @click="renewSubDialog(subscription);" title="Renew">
                    <Icon :icon="iconAdd" />
                </button>
                <button v-if="subscription.id > 0" class="small-button" type="submit" @click="editSubDialog(subscription);" title="Edit">
                    <Icon :icon="iconEdit" />
                </button>
                <button v-if="!subscription.cancelled && subscription.id > 0" type="submit" @click="cancelSubDialog(subscription);" class="small-button-red" title="Cancel">
                    <Icon :icon="iconCancel" />
                </button>
                <span>&nbsp;Exp: {{ subscription.expiration }}</span>
                <span>&emsp;Type: {{ subscription.subtype }}</span>
                <span v-if="subscription.lifetime==1">&emsp;Lifetime</span>
                <span v-else-if="subscription.free">&emsp;Free</span>
                <span v-else-if="subscription.cancelled" style="color: red">&emsp;Cancelled</span>
                <span v-else-if="!subscription.active" style="color: red">&emsp;Expired</span>
            </li>
        </ul>
    </div>
    <span v-else>No subscriptions found</span>
    <div v-if="listDialogVisible" class="modal-backdrop">
    <dialog class="my-dialog" open>
      <h2 v-if="isCancelled" class="error">Cancel Subscription</h2>
      <h2 v-else-if="renew_id > 0">Renew Subscription</h2>
      <h2 v-else-if="edit_id > 0">Edit Subscription</h2>
      <h2 v-else>New Subscription</h2>
      <!-- <form @submit.prevent="newCustomer"> -->
        <div v-if="!isCancelled">
          <div v-if="renew_id <= 0">
            <span v-for="(subType, index) in sub_types" :key="index">
              <input type="radio" :id="subType" :value="subType.id" v-model="format_id">
              <label :for="subType">{{ subType.name }}</label>
            </span>
            <br><br>
          </div>
          <div v-if="edit_id <= 0">
            <button type="submit" @click="setYears(1);">1 Year</button>
            <button type="submit" @click="setYears(2);">2 Years</button>
            <button type="submit" @click="setYears(3);">3 Years</button>
            <button type="submit" @click="setYears(99);">Lifetime</button>
            <br><br>
          </div>
          <label for="years">Years: </label>
          <input type="number" id="years" v-model="years" min="-3" max="100" class="always-show-spinner">
          <label for="issues">&emsp;Issues: </label>
          <input type="number" id="issues" v-model="issues" min="-3" max="100" class="always-show-spinner">
          <br><br>
          <span v-if="renew_id > 0 || edit_id > 0">Current Exp: {{ exp }}</span>
          <span>&emsp;New Exp: {{ newExp }}</span>
        
          <br><br>
          <div v-if="!isCancelled">
            <label for="email">Email: </label>
            <input type="text" id="sub_email" v-model="sub_email" class="sub_email" tabindex="-1">
          </div>
        </div>
        <div v-else>
          <span>&nbsp;Exp: {{ exp }}</span>
          <span v-for="(subType) in sub_types" >
            <span v-if="format_id==subType.id">&emsp;Type: {{ subType.name }}</span>
          </span>
          <br><br>
        </div>
        <label for="memo">Memo: </label>
        <textarea id="memo" v-model="memo" class="memo-textarea"></textarea>
        <br v-if="memoError">
        <span v-if="memoError" class="error">{{ memoError }}</span>
        <br><br>
        <button v-if="isCancelled" type="submit" @click="cancelSubscription();" :disabled="isMemoEmpty">Cancel Subscription</button>
        <button v-else-if="renew_id > 0" type="submit" @click="renewSubscription(newExp);" :disabled="isMemoEmpty">Renew</button>
        <button v-else-if="edit_id > 0" type="submit" @click="editSubscription(newExp);" :disabled="isMemoEmpty">Save Edit</button>
        <button v-else type="submit" @click="newSubscription(newExp);" :disabled="isMemoEmpty">New {{ selectedSubTypeName }}</button>
        <button type="button" @click="listDialogVisible = false;memo = '';isCancelled = false;">Cancel</button>
      <!-- </form> -->
    </dialog>
  </div>
</template>

<script setup>
    import { ref, watch, onMounted, computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useCustomerStore } from '../stores/customer';
    import { Icon } from '@iconify/vue';

    const iconAdd = ref('mdi:refresh');
    const iconCancel = ref('mdi:close');
    const iconEdit = ref('mdi:invoice-text-edit-outline');
    const years = ref(0);
    const issues = ref(0);
    const exp = ref("");
    const format_id = ref(1);
    const thisSub = ref(null);
    const renew_id = ref(0);
    const edit_id = ref(0);
    const sub_email = ref("");
    const listDialogVisible = ref(false);

    const custStore = useCustomerStore();
    const { subscriptions } = storeToRefs(useCustomerStore());

    const newExp = computed(() => {
        if(!exp.value) return "";
        if (years.value == 99) return "5Q99";
        let addIssues = issues.value + (years.value * 4);
        const [quarter, year] = exp.value.split('Q').map(Number);
        let newQuarter = quarter + addIssues;
        let newYear = year;
        while (newQuarter > 4) {
            newQuarter -= 4;
            newYear++;
        }
        while (newQuarter < 1) {
            newQuarter += 4;
            newYear--;
        }

        return `${newQuarter}Q${newYear}`;
    });
    

    const props = defineProps({
        customer: {
            type: Object,
            required: false
        }
    });

    onMounted(async () => {
        const success = await custStore.getCustomerSubscriptionsById(props.customer.id);
        if (!success) {
            alert("Ups, something happened 🙂", error.message);
            console.log("Api status ->", error.message);
        }
    });

    const setYears = (yr) => {
        years.value = yr;
    };

    const cancelSubDialog = async (sub) => {
        console.log("cancelSubDialog: ", sub.id);
        isCancelled.value = true;
        years.value = 0;
        issues.value = 0;
        edit_id.value = -1;
        renew_id.value = sub.id;
        format_id.value = sub.fk_subscription_types_id;
        exp.value = sub.expiration;
        listDialogVisible.value = true;
    }

    const editSubDialog = async (sub) => {
        thisSub.value = sub;
        years.value = 0;
        issues.value = 0;
        renew_id.value = -1;
        edit_id.value = sub.id;
        exp.value = sub.expiration;
        sub_email.value = sub.email;
        format_id.value = sub.fk_subscription_types_id;
        listDialogVisible.value = true;
    }

    const renewSubDialog = async (sub) => {
        thisSub.value = sub;
        years.value = 0;
        issues.value = 0;
        renew_id.value = sub.id;
        edit_id.value = -1;
        exp.value = sub.expiration;
        if( sub.email != undefined ||sub.email == null)
            sub_email.value = props.customer.email;
        else
            sub_email.value = email;
        listDialogVisible.value = true;
    }
</script>

<style scoped>
    .subListComp h3 {
        margin-bottom: 0;
    }
    .small-button {
		padding: 1px;
		background-color: green;
		border: none;
		border-radius: 20%;
		color: white;
		margin-right:.4em;
		margin-bottom: .5em;
	}
	.small-button:hover {
		background-color: darkgreen;
	}
	.small-button-red {
		padding: 1px;
		background-color: red;
		border: none;
		border-radius: 20%;
		color: white;
		margin-right:.4em;
	}
	.small-button-red:hover {
		background-color: darkred;
	}
</style>