import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const isDrawerOpen = ref(false)
  const isSettingsDrawerOpen = ref(false)
  const isModalOpen = ref(false)
  const primaryColor = ref('#1890ff')

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }

  const toggleSettingsDrawer = () => {
    isSettingsDrawerOpen.value = !isSettingsDrawerOpen.value
  }

  const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value
  }

  const setPrimaryColor = (color) => {
    primaryColor.value = color
  }

  return {
    isDrawerOpen,
    isSettingsDrawerOpen,
    toggleSettingsDrawer,
    toggleDrawer,
    isModalOpen,
    toggleModal,
    primaryColor,
    setPrimaryColor
  }
})
