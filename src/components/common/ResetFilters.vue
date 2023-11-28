<script setup>
import { computed } from "vue";
import { ClearOutlined } from "@ant-design/icons-vue";

const props = defineProps({
    filterState: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(["reset"]);

const disabled = computed(() => {
    return !props.filterState.filteredInfo && !props.filterState.sortedInfo;
});

const handleReset = () => {
    emit("reset");
};
</script>
<template>
    <div>
        <a-button @click="handleReset" :disabled="disabled" type="primary">
            <template #icon>
                <ClearOutlined />
            </template>
            Reset Filters
        </a-button>
    </div>
</template>

<style scoped></style>
