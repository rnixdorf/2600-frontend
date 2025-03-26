<template>
    <div v-if="issueDialogVisible" class="issue-dialog">
        <br>
        <span v-for="(subType, index) in sub_types" :key="index">
            <input type="radio" :id="subType" :value="subType.id" v-model="format_id">
            <label :for="subType">{{ subType.name }}</label>
        </span>
        <br><br>
        <!-- </div> -->
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

        <span>&emsp;New Exp: {{ newExp }}</span>
        <br><br>
        <button type="submit" @click="submitData();" :disabled="isSubPicked">Create Sub</button>
	</div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { storeToRefs } from 'pinia'
    import { useCustomerStore } from '../stores/customer'

    const memoError = ref('');
    const years = ref(0);
    const issues = ref(0);
    
    const format_id = ref(1);
    const edit_id = ref(0);
    // const custStore = useCustomerStore();
    const { sub_types, current_issue } = storeToRefs(useCustomerStore());
    const exp = ref("");
    const props = defineProps({
		issueDialogVisible: Boolean,
		data: Object,
	});

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

    // const isMemoEmpty = computed(() => !memo.value);
    const isSubPicked = computed(() => newExp.value === current_issue.value);
    //         return true;
    // ));
    const selectedSubTypeName = computed(() => {
        const selectedSubType = sub_types.value.find(subType => subType.id === format_id.value);
        return selectedSubType ? selectedSubType.name : '';
    });

    const setYears = (y) => {
        years.value = y;;
    };

    onMounted(() => {
        exp.value = current_issue.value;
    });

    const emit = defineEmits(['close-issue', 'submit-issue']);
	
	const close = () => {
		emit('close-issue');
	};

	const submitData = () => {
        // newCustomer('S');listDialogVisible = false
		const data = {}; //{ message: 'Data from dialog' }; // Replace with actual data
        data.format_id = format_id.value;
        data.exp = newExp.value;
		emit('submit-issue', data);
		// close();
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

    /* .my-dialog {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 650px;
        width: 100%;
    } */

    .issue-dialog button {
        background-color: lightgray;
        margin-left: 20px;
    }

    .issue-dialog input[type="radio"] {
        margin-left: 20px;
    } 

    .always-show-spinner::-webkit-inner-spin-button,
    .always-show-spinner::-webkit-outer-spin-button {
        opacity: 1;
    }

    .memo-textarea {
        width: 100%;
        height: 100px;
        resize: vertical; /* Allow vertical resizing */
    }
</style>