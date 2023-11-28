<script setup>
import { useGlobalStore } from '@/store/global'
import { storeToRefs } from 'pinia'

defineProps({
  title: {
    type: String,
    default: 'Settings'
  },

  placement: {
    type: String,
    default: 'right'
  }
})

const store = useGlobalStore()

const { isSettingsDrawerOpen } = storeToRefs(store)
</script>

<template>
  <div>
    <a-drawer
      v-model:open="isSettingsDrawerOpen"
      root-class-name="root-class-name"
      :root-style="{ color: 'blue' }"
      :title="title"
      :placement="placement"
    >
      <div>
        <slot></slot>
      </div>
    </a-drawer>
  </div>
</template>

<style scoped></style>
