<template>
  <main>
    <div>
      <div>
        父組件資料: <input disabled :value="text"/>
      </div>
      <div>
        <MyButton></MyButton> 
      </div>
      <div>
        <MyInput :text="text" @update:text="handleUpdateText"></MyInput> 
      </div>
      <div>
        <MyDataShow :text="text"></MyDataShow>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import MyButton from "./components/MyButton.vue"
import MyInput from "./components/MyInput.vue"
import MyDataShow from "./components/MyDataShow.vue"
import { ref } from "vue";

const text  = ref('預設資料')
const handleUpdateText = (e:string)=>{
  text.value = e
}

</script>