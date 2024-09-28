<template>
 子組件的資料顯示:<input  :value="text"  disabled/>
</template>
<script setup lang="ts">


 defineProps<
  {
  text:{
    type:String
  }
}>()
</script>