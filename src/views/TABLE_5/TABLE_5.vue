<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useGlobalStore } from "@/store/global";
import { useFetch } from "@/composable/useFetch";
import { useFormatTableData } from "@/composable/useFormatTableData";
import { useQueryParams } from "@/composable/useQueryParams";
import Drawer from "@/components/common/Drawer.vue";
import ModalWrapper from "@/components/modal/ModalWrapper.vue";
import ManageData from "./ManageData.vue";
import ResetFilters from "@/components/common/ResetFilters.vue";
import ExportCsv from "@/components/common/ExportCSV.vue";
import Confirm from "@/components/modal/Confirm.vue";
import { EditOutlined, SearchOutlined, DeleteOutlined, ClearOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import dayjs from "dayjs";
import { ApiHost } from "../../../globalConfigs.js";

const [api, contextHolder] = notification.useNotification();

const store = useGlobalStore();
const { toggleDrawer, toggleModal } = store;

const { data, error, loading, get, add, put, remove } = useFetch("admin/table_5");

const { queryParams, setQueryParam } = useQueryParams({
    page: 1,
    limit: 10,
    pagination: 1,
});

const dateFormat = "YYYY-MM-DD";

const tableData = ref([]);
const filteredInfo = ref();
const sortedInfo = ref();
const dateValue = ref();

const columns = computed(() => {
    const filtered = filteredInfo.value || {};
    const sorted = sortedInfo.value || {};

    return [
        {
          key: "id",
          title: "Id",
          dataIndex: "id",
          ellipsis: true,
          customFilterDropdown: true,
          sorter: () => {},
          sortOrder: sorted.field === "id" && sorted.order,
          filteredValue: filtered.id || null,
          onFilterDropdownOpenChange: handleFilterDropdownOpenChange,
        }
      ,
        {
          key: "ascascasc",
          title: "Ascascasc",
          dataIndex: "ascascasc",
          ellipsis: true,
          customFilterDropdown: true,
          sorter: () => {},
          sortOrder: sorted.field === "ascascasc" && sorted.order,
          filteredValue: filtered.ascascasc || null,
          onFilterDropdownOpenChange: handleFilterDropdownOpenChange,
        }
      ,
      {
        key: "actions",
        title: "Actions",
        dataIndex: "actions",
        width: "100",
        fixed: "right",
      },
      
    ];
});

const manageDataType = ref("add");
const total = ref(0);
const limit = ref(10);

const currentItem = reactive({});

const searchInput = ref();
const selectedItemsIds = ref([]);

const searchState = reactive({
    searchText: "",
    searchedColumn: "",
});
const resetState = reactive({
    selectedRowKeys: [],
    loading: false,
});

const hasSelected = computed(() => resetState.selectedRowKeys.length > 0);

const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
};

const handleResetFilters = () => {
    sortedInfo.value = null;
    filteredInfo.value = null;

    const updatedQuery = {
        page: 1,
        limit: 10,
        pagination: 1,
    };

    updateUrl(updatedQuery);
};

const handleFilterDropdownOpenChange = (visible) => {
    if (visible) {
        setTimeout(() => {
            searchInput.value.focus();
        }, 100);
    }
};

const onSelectChange = (selectedRowKeys) => {
    resetState.selectedRowKeys = selectedRowKeys;
};

const handleResetSearch = (clearFilters, key) => {
    searchState.searchText = "";

    if (filteredInfo.value) {
        delete filteredInfo.value[key];
    }

    const queries = JSON.parse(JSON.stringify(queryParams.value));

    delete queries.search[key];

    if (Object.keys(queries.search).length === 0) {
        delete queries.search;
    }

    updateUrl(queries);
};

const handleDeleteSelected = async () => {
    const foundItemsIds = resetState.selectedRowKeys.map((item) => {
        return tableData.value[item].id;
    });

    selectedItemsIds.value = foundItemsIds;
    toggleModal();
};

function handleAdd() {
    toggleDrawer();
    manageDataType.value = "add";
}

function handleEdit(col) {
    toggleDrawer();
    currentItem.value = col;
    manageDataType.value = "edit";
}

function handleDelete(col) {
    toggleModal();
    currentItem.value = col;
}

async function handleConfirm(param) {
    if (param) {
        const item = selectedItemsIds.value.length ? selectedItemsIds.value : currentItem.value.id;

        await deleteData(item);
    }
    toggleModal();
}

async function handleSubmit(form) {
    await addData(form);

    await getData();
}

async function deleteData(id) {
    try {
        const res = await remove(id);
        getData();
        api.success({
            message: "Success",
            description: "Data deleted successfully",
        });
    } catch (err) {
        api.error({
            message: "Error",
            description: "Something went wrong",
        });
    }
}

async function getData(queryParams) {
    const res = await get(queryParams);

    total.value = res.count;
    limit.value = res.limit;

    const { formattedTableData } = useFormatTableData(res.rows, columns.value);

    tableData.value = formattedTableData.data;
}

async function addData(data) {
    if (manageDataType.value === "edit") {
        const id = currentItem.value.id;
        data.id = id;

        await put(data);
        return;
    }

    await add(data);
}

const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const { order, field } = sorter;

    const params = {
        page: current,
        limit: pageSize,
        pagination: 1,
    };

    const isFiltered = Object.values(filters).some((item) => item && item.length);

    if (isFiltered) {
        const searchQuery = Object.entries(filters).reduce((acc, item) => {
            const [key, value] = item;

            if (!value) return acc;

            if (value.length) {
                acc[key] = value[0];
                filteredInfo.value = {
                    ...filteredInfo.value,
                    [key]: [value[0]],
                };
            }

            return acc;
        }, {});

        params.search = searchQuery;
    } else {
        filteredInfo.value = null;
        delete params.search;
    }

    if (order) {
        params.sort = [field, order === "ascend" ? "asc" : "desc"];
        sortedInfo.value = {
            field,
            order,
        };
    } else {
        sortedInfo.value = null;
    }

    updateUrl(params);
};

const updateUrl = (params) => {
    setQueryParam(params);
};

watch(
    () => dateValue.value,
    (value) => {
        if (value) {
            const [startDate, endDate] = value;

            const updatedQuery = {
                ...queryParams.value,
                between: { createdAt: { from: startDate, to: endDate } },
            };

            updateUrl(updatedQuery);
        } else {
            const updatedQuery = JSON.parse(JSON.stringify(queryParams.value));

            delete updatedQuery.between;

            updateUrl(updatedQuery);
        }
    }
);

const isEpmty = (obj) => {
    return Object.keys(obj.value).length === 0;
};

watch(
    () => queryParams.value,
    (value) => {
        if (value.search) {
            for (const [key, val] of Object.entries(value.search)) {
                filteredInfo.value = {
                    ...filteredInfo.value,
                    [key]: [val],
                };
            }
        }

        if (value.sort) {
            sortedInfo.value = {
                field: value.sort[0],
                order: value.sort[1] === "asc" ? "ascend" : "descend",
            };
        }

        getData(value);
    },
    {
        deep: true,
    }
);

onMounted(() => {
    const queries = JSON.parse(JSON.stringify(queryParams.value));

    if (queries.between) {
        const { createdAt } = queries.between;

        dateValue.value = [dayjs(createdAt.from, dateFormat), dayjs(createdAt.to, dateFormat)];
    }
});
</script>

<template>
    <div>
        <contextHolder />

        <modal-wrapper>
            <confirm @confirm="handleConfirm" />
        </modal-wrapper>

        <drawer :title="manageDataType == 'edit' ? 'Edit' : 'Add'">
            <manage-data @submit="handleSubmit" :data="currentItem" :type="manageDataType" />
        </drawer>

        <div class="table-actions_wrapper">
            <div>
                <delete-many
                    :resetState="resetState"
                    :disabled="!hasSelected"
                    @delete="handleDeleteSelected"
                />
            </div>

            <div>
                <reset-filters
                    :filterState="{ filteredInfo, sortedInfo }"
                    @reset="handleResetFilters"
                />
            </div>

            <div>
                <a-range-picker v-model:value="dateValue" :disabled="!tableData.length" />
            </div>

            <div>
                <export-csv :data="tableData" />
            </div>

            <a-button class="add-button" @click="handleAdd">Add</a-button>
        </div>

        <a-table
            :row-selection="{
                selectedRowKeys: searchState.selectedRowKeys,
                onChange: onSelectChange,
            }"
            :columns="columns"
            :data-source="tableData"
            :scroll="{ x: 'max-content', y: null }"
            :loading="loading"
            @change="handleTableChange"
            :pagination="{
                total: total,
                pageSize: limit,
                showSizeChanger: true,
                showQuickJumper: true,
                current: +queryParams.page || 1,
                showTotal: (total) => `Total ${total} items`,
            }"
        >
            <template
                #customFilterDropdown="{
                    setSelectedKeys,
                    selectedKeys,
                    confirm,
                    clearFilters,
                    column,
                }"
            >
                <div style="padding: 8px">
                    <a-input
                        ref="searchInput"
                        :placeholder="`Search ${column.dataIndex}`"
                        :value="selectedKeys[0]"
                        style="width: 188px; margin-bottom: 8px; display: block"
                        @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                        @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
                    />
                    <a-button
                        type="primary"
                        size="small"
                        style="width: 90px; margin-right: 8px"
                        @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
                    >
                        <template #icon><SearchOutlined /></template>
                        Search
                    </a-button>
                    <a-button
                        size="small"
                        style="width: 90px"
                        @click="handleResetSearch(clearFilters, column.dataIndex)"
                    >
                        Reset
                    </a-button>
                </div>
            </template>
            <template #customFilterIcon="{ filtered }">
                <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
            </template>

            <template #bodyCell="{ column, record }">
                <div v-if="column.key === 'actions'" class="icons-parent">
                    <edit-outlined class="icon edit-icon" @click="() => handleEdit(record)" />
                    <delete-outlined class="icon delete-icon" @click="() => handleDelete(record)" />
                </div>

                
            </template>
        </a-table>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/stylesheets/mixins.scss";

.table-actions_wrapper {
    @include mx-flex(flex-end);
    margin-bottom: 20px;

    div {
        margin-right: 10px;
    }

    .selected-items_text {
        margin-right: 10px;
    }
}

.edit-icon {
    color: #1890ff;
    margin-right: 10px;
}

.delete-icon {
    color: #ff4d4f;
}

.icons-parent {
    @include mx-flex;
}

.icon {
    cursor: pointer;
}
</style>
