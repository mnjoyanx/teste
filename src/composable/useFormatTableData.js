import { reactive } from 'vue'

export function useFormatTableData(tableData) {
  const formattedTableData = reactive({
    columns: [],
    data: []
  })

  if (tableData && tableData.length) {
    const cols = Object.keys(tableData[0])

    const idIndex = cols.indexOf('id')
    if (idIndex > -1) {
      cols.splice(idIndex, 1)
      cols.unshift('id')
    }

    formattedTableData.columns = cols.map((key, index) => {
      return {
        key: index.toString(),
        title: key,
        dataIndex: key,
        width: 100,
        fixed: 'left',
        type: 'text'
      }
    })

    formattedTableData.columns.push({
      key: 'actions',
      title: 'Actions',
      dataIndex: 'actions',
      width: 100,
      fixed: 'right'
    })

    formattedTableData.data = tableData.map((key, index) => {
      console.log(cols[index])
      const keyName = cols[index]
      return {
        key: index.toString(),
        [keyName]: tableData[index][keyName],
        ...tableData[index],
        actions: 'actions'
      }
    })
  }

  return { formattedTableData }
}
