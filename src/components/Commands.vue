<script setup>
import { ref, onMounted  } from 'vue'
import axios from 'axios';


defineProps({
  msg: String,
  customer: {
      type: Object,
      required: true
    }
})

const arrCommands = ref([]);
const cmdUrl = ref(null);
const isOutputDialogVisible = ref(false);
const output = ref('');
const running_row = ref(null);

const isRowRunning = computed(() => running_row.value);

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
      targetUrl = currentUrl + "/2600-srvr/";
    }
    cmdUrl.value = targetUrl;
    const response = await axios.get(`${cmdUrl.value}/commands`);
    arrCommands.value = response.data;
  } catch (err) {
    err.value = 'Failed to fetch commands.';
  }
});

const run = async (row) => {
  running_row.value = row.name;
  const response = await axios.post(`${cmdUrl.value}/commands/${row.name}`);
  running_row.value = null;
  console.log("run response: ",response.data);
  output.value = response.data;
  isOutputDialogVisible.value = true;
}


const checkRunning = async (row) => {
  if (running_row.value == row.name) {
    return true;
  } else {
    return false;
  }
}

</script>

<template>
  <h3>commands</h3>
  <el-table :data="arrCommands">
    <el-table-column prop="display" label="Command"></el-table-column>
    <el-table-column >
      <template v-slot:default="scope">
        <el-button @click="run(scope.row)">
          <span >Start</span> <div  v-if="running_row === scope.row.name" style="padding-left: 30px;" v-loading=true></div>
          
        </el-button>
      </template>
    </el-table-column>

  </el-table> 

  <el-dialog v-model="isOutputDialogVisible"
    title="Confirm"
    width="100%"
    height="100%"
    @close="isOutputDialogVisible = false">
    <div v-html='output' id='txtOutput'></div><br><br>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isOutputDialogVisible = false">Close</el-button>
    </span>
  </el-dialog>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
#txtOutput {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
