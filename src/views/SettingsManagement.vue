<template>
    <div class="settings-form">
        <h1>Settings</h1>
        <form @submit.prevent="updateSettings">
            <div>
                <label for="currentIssue">Current Issue:&nbsp;</label>
                <input type="text" v-model="currentIssue" id="currentIssue"  />
            </div>
            <div>
                <label for="onSaleDate">On Sale Date:&nbsp;</label>
                <input type="date" v-model="onSaleDate" id="onSaleDate"  />
            </div>
            
            <br><br>
            <button type="submit">Save</button>
            <button type="cancel" @click="cancel">Cancel</button>
        </form>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { storeToRefs } from 'pinia'
    import { useCustomerStore } from '../stores/customer'
    const custStore = useCustomerStore();
    // const { current_issue, on_sale_date } = storeToRefs(useCustomerStore());
    const currentIssue = ref('');
    const onSaleDate = ref('');
    const router = useRouter();
    const updateSettings = async () => {

        await custStore.updateSettings({ current_issue: currentIssue.value, onsale: onSaleDate.value });
        router.push('/');
    };
    onMounted(() => {
        currentIssue.value = custStore.current_issue;
        onSaleDate.value = custStore.on_sale_date;
    });
    const cancel = () => {
        router.push('/');
    };


</script>
  
<style scoped>
  /* Add your styles here */
    .settings-form form button[type="submit"] {
        background-color: cadetblue;
    }

    .settings-form form button[type="cancel"] {
        background-color: red;
        margin-left: 2em;
    }
</style>
