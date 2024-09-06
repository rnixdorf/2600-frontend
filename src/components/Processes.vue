<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';


defineProps({
  msg: String,
})
const items = ref([]);
const error = ref(null);
const isStopDialogVisible = ref(false);
let selectedRow = null;
let apiUrl = null;

const count = ref(0)

onMounted(async () => {
  try {
    const currentUrl = window.location.origin;
    let targetUrl = "";
    let isTunnel = currentUrl.indexOf('5173') > -1;
    if(isTunnel) {
      targetUrl = currentUrl.replace('5173', '3000');
    }
    else
    {
      targetUrl = currentUrl + "/2600-srvr";
    };
    apiUrl = targetUrl;
    let newUrl = currentUrl.replace('5173', '3000');
    const response = await axios.get(`${targetUrl}/processes`);
    items.value = response.data;
  } catch (err) {
      error.value = 'Failed to fetch data.';
  }
});

const start = (row) => {
  console.log(row); // logic to start the process
};

const stop = (row) => {
  console.log(row);// logic to stop the process
  selectedRow = row;  // Store the row
  isStopDialogVisible.value = true;
};

const restart = async (row) => {
  console.log(row);// logic t
  const response = await axios.get(`${apiUrl}/processes/${row.pm_id}/restart`);
  if(response.data.status == 'success') {
    console.log('success');
  }
  else {
    console.log('response.data.message');
  }
  
};



const confirmStop = () => {
  isStopDialogVisible.value = false;  // Close the dialog
  //stop(selectedRow);  // Call your original stop function
};
</script>

<template>
  <el-table :data="items">
    <el-table-column width="100" prop="pm_id" label="ID"></el-table-column>
    <el-table-column prop="name" label="Process Name"></el-table-column>
    <el-table-column width="200" prop="pm2_env.status" label="Status"></el-table-column>
    <el-table-column label="Actions">
      <template v-slot:default="scope">
        <!--
        <el-button @click="start(scope.row)">Start</el-button>
        <el-button @click="stop(scope.row)">Stop</el-button>
      -->
        <el-button @click="restart(scope.row)">Restart</el-button>
      </template>
    </el-table-column>

  </el-table> 

  <!-- Confirmation Dialog -->
  <el-dialog v-model="isStopDialogVisible"
    title="Confirm"
    width="30%"
    @close="isStopDialogVisible = false">
    <span>Are you sure you want to stop this process?</span><br><br>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isStopDialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="confirmStop">Confirm</el-button>
    </span>
  </el-dialog>


  <p v-if="error">{{ error }}</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.pm_id_col {
  width: 10px;
}

</style>
