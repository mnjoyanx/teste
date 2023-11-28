<script setup>
import { ref } from 'vue';

import { useGlobalStore } from '@/store/global';

const store = useGlobalStore();
const { setPrimaryColor } = store;

const colors = ref(['#00A76F', '#078DEE', '#fda92d', '#FF3030', '#7635dc']);

const handleSelectColor = (color) => {
  setPrimaryColor(color);
  localStorage.setItem('primaryColor', color);
};
</script>
<template>
  <div>
    <div>
      <a-typography-title :level="3">Primary Color</a-typography-title>
      <color-picker :data="colors" @selectColor="handleSelectColor" />
    </div>
  </div>
</template>

<style scoped></style>
