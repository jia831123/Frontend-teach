<template>
 子組件輸入框:<input :value="text" @input="e=>emit('update:text',(e.target.value as string))"/>
</template>
<script setup lang="ts">


defineProps<
  {
  text:{
    type:String
  }
}>()
const emit = defineEmits<{
  (e:'update:text',v:string):void
}>()
</script>