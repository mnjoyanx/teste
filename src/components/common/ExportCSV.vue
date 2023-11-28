<script setup>
import { computed } from 'vue'

import { DownloadOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const disabled = computed(() => {
  return props.data.length === 0
})

const handleExport = () => {
  const data = props.data.map((item) => {
    const obj = {}

    for (let key in item) {
      obj[key] = item[key]
    }

    return obj
  })

  const replacer = (key, value) => (value === null ? '' : value)
  const header = Object.keys(data[0])
  let csv = data.map((row) =>
    header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
  )
  csv.unshift(header.join(','))
  csv = csv.join('\r\n')

  const blob = new Blob([csv], { type: 'text/csv' })

  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = 'data.csv'
  link.click()
}
</script>

<template>
  <div>
    <a-button @click="handleExport" :disabled="disabled">
      <download-outlined />
      Export CSV</a-button
    >
  </div>
</template>
