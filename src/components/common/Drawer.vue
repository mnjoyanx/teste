<script setup>
import { useGlobalStore } from '@/store/global'
import { storeToRefs } from 'pinia'

defineProps({
  title: {
    type: String,
    default: 'Add'
  },
  placement: {
    type: String,
    default: 'right'
  }
})

const store = useGlobalStore()

const { isDrawerOpen } = storeToRefs(store)

const { toggleDrawer } = store

const showDrawer = () => {
  toggleDrawer()
}
</script>

<template>
  <div>
    <a-drawer
      v-model:open="isDrawerOpen"
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
