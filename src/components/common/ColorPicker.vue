<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['selectColor']);

const handleSelectColor = (color) => {
  emit('selectColor', color);
};
</script>
<template>
  <div class="picker-wrapper">
    <div
      v-for="item in data"
      :key="item"
      class="color-picker"
      :style="{ backgroundColor: item }"
      @click="handleSelectColor(item)"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.picker-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .color-picker {
    width: 20px;
    height: 20px;
    border-radius: 3px;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
