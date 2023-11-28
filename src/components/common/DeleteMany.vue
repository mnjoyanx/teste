<script setup>
import { DeleteOutlined } from "@ant-design/icons-vue";

const props = defineProps({
    resetState: {
        type: Object,
        default: () => ({}),
    },

    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["delete"]);

const handleDeleteSelected = () => {
    emit("delete");
};
</script>
<template>
    <div>
        <span v-if="!disabled" class="selected-items_text">
            {{ `Selected ${resetState.selectedRowKeys.length} items ` }}
        </span>
        <a-button
            type="primary"
            :disabled="disabled"
            :loading="resetState.loading"
            @click="handleDeleteSelected"
            danger
        >
            <delete-outlined />
            Delete
        </a-button>
    </div>
</template>

<style scoped></style>
